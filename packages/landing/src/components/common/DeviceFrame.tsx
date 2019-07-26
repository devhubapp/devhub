import React from 'react'

export interface DeviceFrameProps {
  children: React.ReactChild
  // device?: 'android' | 'iphone' | 'auto'
}

export function DeviceFrame(props: DeviceFrameProps) {
  const { children } = props

  return (
    <div className="temp-wrapper">
      <div className="iphone">
        <div className="iphone__body">
          <div className="iphone__body__cut" />
          <div className="iphone__body__speaker" />
          <div className="iphone__body__sensor" />

          <div className="iphone__body__mute" />
          <div className="iphone__body__up" />
          <div className="iphone__body__down" />
          <div className="iphone__body__right" />
        </div>

        <div className="iphone__screen">
          <div className="iphone__screen__">
            <div className="iphone__screen__frame">
              <div className="w-full h-full bg-default">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
