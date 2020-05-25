## How to generate the files

1. Run `yarn`, it will install `@primer/octicons-v2@canary`
2. Go to https://icomoon.io/app and create a icon set with the svgs from `./node_modules/@primer/octicons-v2/build/svg`
3. Download the zip from icomoon to your `~/Downloads` folder and extract it
4. Copy the `.ttf` file from the unziped folder to `./packages/components/src/libs/vector-icons/fonts/octicons2/assets/`
5. At the root of this project, run `./node_modules/.bin/generate-icon ~/Downloads/Octicons2-v10.0/style.css --componentName=Octicons2 --fontFamily=Octicons2 > ./packages/components/src/libs/vector-icons/fonts/octicons2/assets/Octicons2.ts`
