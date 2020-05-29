# Source: https://gist.github.com/fermoya/f9be855ad040d5545ae3cb254ed201e4
###### CONSISTENCY BETWEEN MACOS AND IOS #####
#
# In order to use the same PodFile with MacOS, we need to unlink the libraries that do not support Catalyst, filter
# files in native targets build phases, filter dependencies and make sure the unsupported frameworks along with their
# their bundle resources are not included in the final archive. For that, we use `platform_filter` to specify 'ios' and
# 'OTHER_LDFLAGS[sdk=iphone*]' to link those libraries for iPhone and iPad. Besides, we modify "*frameworks.sh" and 
# "*resrouces.sh" to skip installation for architecture x86_64.
#
# *Notice*: 'sdk=iphone*' excludes macOS, even though Catalyst is compiled with iOS SDK.
#
# ADDING A NEW LIBRARY
#
# Pass the name of the new library to the script
#
###### RESOURCES #######
#
# https://www.bitbuildr.com/tech-blog/mac-catalyst-porting-an-app-using-crashlytics-firebase - Article that inspired this script
# https://github.com/CocoaPods/Xcodeproj - Xcode configuration using ruby. This Framework is already included on cocoapods environment
# https://www.rubydoc.info/gems/xcodeproj/Xcodeproj/Project/Object/AbstractTarget Wiki for Xcodeproj
#

include Xcodeproj::Project::Object
include Pod

$verbose = false

def loggs string
  if $verbose
    puts string
  end
  return
end

# EXTENSIONS

class String
  def filter_lines
    lines = []
    each_line do |line| 
      if yield line
        lines = lines + [line]
      end
    end
    return lines
  end
end

class PBXNativeTarget

  ###### STEP 4 ######
  # In "Pods-" targets, modify "*frameworks.sh" to not install unsupported frameworks for platform architectures
  def uninstall_frameworks frameworks, platform, configurations
    uninstall frameworks, "#{name}-frameworks.sh", platform.architectures, configurations
  end

  ###### STEP 5 ######
  # In "Pods-" targets, modify "*resources.sh" to not install unsupported frameworks for platform architectures
  def uninstall_resources resources, platform, configurations
    uninstall resources, "#{name}-resources.sh", platform.architectures, configurations
  end

  def support_files_folder
    build_configurations.filter do |config| not config.base_configuration_reference.nil? end.first.base_configuration_reference.real_path.parent
  end

  @private
  def uninstall keys, file_name, architectures, configurations=nil
    configurations = configurations.nil? ? build_configurations.map { |b| b.name } : configurations
    keys = keys.to_set.to_a
    loggs "\t\t\tUninstalling for configurations: #{configurations}"
    if support_files_folder.nil?
      loggs "\t\t\tNothing to uninstall"
      return
    end

    script_path = support_files_folder.join file_name
    if !script_path.exist?
      loggs "\t\t\tNothing to uninstall"
      return
    end

    script = File.read(script_path)
    snippets = script.scan(/if \[\[ \"\$CONFIGURATION\" [\S\s]*?(?=fi\n)fi/)
    condition = architectures.map do |arch| "[ \"$ARCHS\" != \"#{arch}\" ]" end.reduce("") do |total, piece| total.empty? ? piece : total + " || " + piece end
    changed = false
    
    snippets.filter do |snippet|
      configurations.map do |string| snippet.include? string end.reduce(false) do |total, condition| total = total || condition end
    end.each do |snippet|
      new_snippet = snippet.clone
      keys.each do |key|
        lines_to_replace = snippet.filter_lines do |line| line.include? "#{key}" end.to_set.to_a
        unless lines_to_replace.empty?
          changed = true
          lines_to_replace.each do |line|
            new_snippet.gsub! line, "\tif #{condition}; then \n\t#{line}\tfi\n"
          end
        end
      end
      script.gsub! snippet, new_snippet
    end

    if changed
      File.open(script_path, "w") { |file| file << script }
    end
    loggs "\t\t\t#{changed ? "Succeded" : "Nothing to uninstall"}"
  end

  ###### STEP 1 ######
  # In native target's build phases, add platform filter to:
  # - Resources 
  # - Compile Sources
  # - Frameworks
  # - Headers
  def add_platform_filter_to_build_phases platform
    loggs "\t\t- Filtering resources"
    resources_build_phase.files.to_a.map do |build_file| build_file.platform_filter = platform.name end
    
    loggs "\t\t- Filtering compile sources"
    source_build_phase.files.to_a.map do |build_file| build_file.platform_filter = platform.name end
    
    loggs "\t\t- Filtering frameworks"
    frameworks_build_phase.files.to_a.map do |build_file| build_file.platform_filter = platform.name end
    
    loggs "\t\t- Filtering headers"
    headers_build_phase.files.to_a.map do |build_file| build_file.platform_filter = platform.name end
  end

end

class PodTarget

  def module_name
    string = name.clone.gsub! /-iOS[0-9]+(\.[0-9])+$/, ''
    return string.nil? ? name : string
  end

  def resources 
    return file_accessors.flat_map do |accessor| accessor.resources end.map do |path| "#{path.basename}" end
  end
  
  def vendor_products
    return file_accessors.flat_map do |accessor| 
      accessor.vendored_frameworks + accessor.vendored_libraries
    end.map do |s| s.basename 
    end.map do |s|
      name = "#{s}"
      if name.include? "framework"
        PodDependency.newFramework name.sub(".framework", "")
      else
        PodDependency.newLibrary name.sub("lib", "").sub(".a", "")
      end
    end
  end

  def frameworks
    return file_accessors.flat_map do |accessor| 
      accessor.spec_consumer.frameworks.map do |name| PodDependency.newFramework name  end + accessor.spec_consumer.libraries.map do |name| PodDependency.newLibrary name end
    end
  end

end

class PBXTargetDependency
  def module_name
    string = name.clone.gsub! /-iOS[0-9]+(\.[0-9])+$/, ''
    return string.nil? ? name : string
  end
end

class AbstractTarget

  def module_name
    string = name.clone.gsub! /-iOS[0-9]+(\.[0-9])+$/, ''
    return string.nil? ? name : string
  end

  ###### STEP 2 ######
  # In all targets (aggregates + native), filter dependencies
  def add_platform_filter_to_dependencies platform
    loggs "\t\t- Filtering dependencies"
    dependencies.each do |dependency|
      dependency.platform_filter = platform.name
    end
  end

  ###### STEP 3 ######
  # If any unsupported library, then flag as platform-dependant for every build configuration
  def flag_libraries libraries, platform
    loggs "\tTarget: #{name}"
    build_configurations.filter do |config| not config.base_configuration_reference.nil? 
    end.each do |config|
      loggs "\t\tScheme: #{config.name}"
      xcconfig_path = config.base_configuration_reference.real_path
      xcconfig = File.read(xcconfig_path)

      changed = false
      libraries.each do |framework|
        if xcconfig.include? framework
          xcconfig.gsub!(framework, '')
          unless xcconfig.include? "OTHER_LDFLAGS[sdk=#{platform.sdk}]"
            changed = true
            xcconfig += "OTHER_LDFLAGS[sdk=#{platform.sdk}] = $(inherited) -ObjC "
          end
          xcconfig += framework + ' '
        end
      end

      File.open(xcconfig_path, "w") { |file| file << xcconfig }
      loggs "\t\t\t#{changed ? "Succeded" : "Nothing to flag"}"
    end
  end

  def to_dependency
    # We return both as we don't know if build as library or framework
    return [PodDependency.newFramework(module_name), PodDependency.newLibrary(module_name)]
  end

  # Dependencies contained in Other Linker Flags
  def other_linker_flags_dependencies
    frameworks = Array.new
    libraries = Array.new
  
    config = build_configurations.filter do |config| not config.base_configuration_reference.nil? end.first
    xcconfig_path = config.base_configuration_reference.real_path
    xcconfig = File.read(xcconfig_path)
    xcconfig.gsub!(/\r\n?/, "\n")
  
    xcconfig.each_line do |line|
      if line.start_with? 'OTHER_LDFLAGS'
        frameworks = frameworks + line.split("-framework").map do |s|
          s.strip.delete("\n") end.filter do |s| 
          s.strip.start_with? '"' end
        libraries = libraries + line.split("-l").filter do |s| s.strip.start_with? '"' end.map do |s| s.strip.split(' ').first end
      end
    end

    libraries = libraries.map do |name| PodDependency.newLibrary(name.gsub!("\"", "")) end
    frameworks = frameworks.map do |name| PodDependency.newFramework(name.gsub!("\"", "")) end

    return OtherLinkerFlagsDependencies.new libraries, frameworks 
  end
end

# HELPER CLASSES

class PodDependency
  attr_reader :name
  attr_reader :type

  def link
    if library?
      return "-l\"#{name}\""
    else
      return "-framework \"#{name}\"" 
    end
  end

  def library?
    return type == "library"
  end

  def framework?
    return type == "framework"
  end

  def self.newFramework name
    return PodDependency.new(name, "framework")
  end

  def self.newLibrary name
    return PodDependency.new(name, "library")
  end

  def ==(other)
    name == other.name && type == other.type
   end

  def eql?(other)
    name == other.name
   end

  private
  def initialize(name, type)
    @name = name
    @type = type
  end

end

class OtherLinkerFlagsDependencies
  attr_reader :libraries
  attr_reader :frameworks

  def initialize(libraries = [], frameworks = [])
    @libraries = libraries
    @frameworks = frameworks
  end

  def combine dependencies
    frameworks = (dependencies.frameworks + @frameworks).to_set.to_a
    libraries = (dependencies.libraries + @libraries).to_set.to_a
    return OtherLinkerFlagsDependencies.new libraries, frameworks
  end

  def dependencies
    libraries + frameworks
  end

end

class OSPlatform
  attr_reader :sdk
  attr_reader :name
  attr_reader :architectures

  def self.ios
    OSPlatform.new 'ios', 'iphone*', ['arm64', 'armv7s', 'armv7']
  end

  def self.macos
    OSPlatform.new 'macos', 'macosx*', ['x86_64']
  end

  def self.wtachos
    OSPlatform.new 'watchos', 'watchos*', ['arm64_32', 'armv7k']
  end

  def self.tvos
    OSPlatform.new 'tvos', 'appletvos*', ['arm64']
  end

  private 
  def initialize(name, sdk, architectures)
    @name = name
    @sdk = sdk
    @architectures = architectures
  end

end

# SCRIPT

class Installer

  def configure_support_catalyst pod_names_to_keep, pod_names_to_remove, configurations=nil

    ###### Variable definition ###### 
    targets = pods_project.targets

    pod_names_to_remove = pod_names_to_remove.map do |name| name.sub('/', '') end
    pod_names_to_keep = pod_names_to_keep.map do |name| name.sub('/', '') end

    pod_names_to_keep = recursive_dependencies pod_names_to_keep
    pod_names_to_remove = recursive_dependencies(pod_names_to_remove).filter do |name| !pod_names_to_keep.include? name end

    pod_targets_to_keep = pod_targets.filter do |pod| pod_names_to_keep.include? pod.module_name end       # PodTarget
    pod_targets_to_remove = pod_targets.filter do |pod| pod_names_to_remove.include? pod.module_name end   # PodTarget

    loggs "\n#### Unsupported Libraries ####\n#{pod_names_to_remove}\n"

    targets_to_remove = targets.filter do |target| pod_names_to_remove.include?(target.module_name) end  # AbstractTarget
    pods_targets = targets.filter do |target| target.name.start_with? "Pods-" end   # AbstractTarget
    cross_platform_targets = targets.filter do |target| !targets_to_remove.include?(target) && !pods_targets.include?(target) end   # AbstractTarget

    ######  Determine which dependencies should be removed ###### 
    dependencies_to_keep = cross_platform_targets.reduce(OtherLinkerFlagsDependencies.new) do |dependencies, target| 
      dependencies.combine target.other_linker_flags_dependencies 
    end.dependencies
    
    # [PodDependency]
    dependencies_to_keep = dependencies_to_keep + cross_platform_targets.flat_map do |target| target.to_dependency end + pod_targets_to_keep.flat_map do |pod| pod.vendor_products + pod.frameworks end

    dependencies_to_remove = targets_to_remove.reduce(OtherLinkerFlagsDependencies.new) do |dependencies, target| 
      dependencies.combine target.other_linker_flags_dependencies 
    end.dependencies
    
    # [PodDependency]
    dependencies_to_remove = dependencies_to_remove + targets_to_remove.flat_map do |target| target.to_dependency end + pod_targets_to_remove.flat_map do |pod| pod.vendor_products + pod.frameworks end
    dependencies_to_remove = dependencies_to_remove.filter do |d| !dependencies_to_keep.include? d end

    ###### CATALYST NOT SUPPORTED LINKS ###### 
    unsupported_links = dependencies_to_remove.map do |d| d.link end.to_set.to_a
    
    loggs "#### Unsupported dependencies ####\n"
    loggs "#{dependencies_to_remove.map do |d| d.name end.to_set.to_a }\n\n"

    ###### CATALYST NOT SUPPORTED FRAMEWORKS AND RESOURCES
    frameworks_to_uninstall = dependencies_to_remove.filter do |d| d.framework? end.map do |d| "#{d.name}.framework" end.to_set.to_a
    resources_to_uninstall = pod_targets_to_remove.flat_map do |pod| pod.resources end.to_set.to_a

    loggs "#### Frameworks not to be included in the Archive ####\n"
    loggs "#{frameworks_to_uninstall}\n\n" 

    loggs "#### Resources not to be included in the Archive ####\n"
    loggs "#{resources_to_uninstall}\n\n"

    ###### OTHER LINKER FLAGS -> to iphone* ###### 
    loggs "#### Flagging unsupported libraries ####"
    targets.each do |target| target.flag_libraries unsupported_links, OSPlatform.ios end

    ###### BUILD_PHASES AND DEPENDENCIES -> PLATFORM_FILTER 'ios' ###### 
    loggs "\n#### Filtering build phases ####"
    targets_to_remove.filter do |target| 
      pods_project.native_targets.include? target
    end.each do |target| 
      loggs "\tTarget: #{target.name}"
      target.add_platform_filter_to_build_phases OSPlatform.ios 
      target.add_platform_filter_to_dependencies OSPlatform.ios
    end

    loggs "\n#### Filtering dependencies ####"
    targets_to_remove.filter do |target| 
      !pods_project.native_targets.include? target
    end.each do |target| 
      loggs "\tTarget: #{target.name}"
      target.add_platform_filter_to_dependencies OSPlatform.ios 
    end

    ###### FRAMEWORKS AND RESOURCES SCRIPT -> if [ "$ARCHS" != "x86_64" ]; then #######   
    loggs "\n#### Chagings frameworks and resources script ####"
    pods_targets.each do |target|
      loggs "\tTarget: #{target.name}"
      loggs "\t\t-Uninstalling frameworks"
      target.uninstall_frameworks frameworks_to_uninstall, OSPlatform.macos, configurations

      loggs "\t\t-Uninstalling resources"
      target.uninstall_resources resources_to_uninstall, OSPlatform.macos, configurations
    end
  end

  @private
  def recursive_dependencies to_filter_names
    targets = pods_project.targets
    targets_to_remove = targets.filter do |target| to_filter_names.include? target.module_name end
    dependencies = targets_to_remove.flat_map do |target| target.dependencies end
    dependencies_names = dependencies.map do |d| d.module_name end
  
    if dependencies.empty?
      return to_filter_names + dependencies_names
    else
      return to_filter_names + recursive_dependencies(dependencies_names)
    end
  
  end

end