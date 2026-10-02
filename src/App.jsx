import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [type, setType] = useState('URL')
  const [wifiName, setWifiName] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiSecurity, setWifiSecurity] = useState('WPA')

  const [size, setSize] = useState(200)
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')
  const [step, setStep] = useState(1)
  const [customizing, setCustomizing] = useState(false)
  const [centerImage, setCenterImage] = useState(null)

  let qrValue = text

  if (type === 'Email') {
    qrValue = `mailto:${text}`
  }

  if (type === 'Phone Number') {
    qrValue = `tel:${text}`
  }

  if (type === 'Wi-Fi') {
    qrValue = `WIFI:T:${wifiSecurity};S:${wifiName};P:${wifiPassword};;`
  }

  const presets = [
  {
    name: 'Lavender',
    foreground: '#563A78',
    background: '#F5F0FA'
  },
  {
    name: 'Sage',
    foreground: '#285943',
    background: '#F1F7F3'
  },
  {
    name: 'Ocean',
    foreground: '#145A78',
    background: '#EFF8FC'
  },
  {
    name: 'Cherry',
    foreground: '#D2042D',
    background: '#F1F4FF'
  },
  {
    name: 'Mocha',
    foreground: '#603B2B',
    background: '#FBF3EC'
  },
  {
    name: 'Sunset',
    foreground: '#A13F25',
    background: '#FFF1E9'
  },
  {
    name: 'Midnight',
    foreground: '#25243A',
    background: '#FFFFFF'
  },
  {
    name: 'Classic',
    foreground: '#111111',
    background: '#FFFFFF'
  },
  {
    name: 'Customize',
    custom: true
  }
]

  return (
    <>
      {step === 1 && (
        <div className="app">
      <div className="container">

        <div className="header">
          <h1>QR Studio </h1>
          <p>Create your own customizable QR code</p>
        </div>

        <div className="content">

          <div className="card">
            <h2>Create</h2>

            <div className="input-section">
              <label>QR Type</label>

               <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}>
                  <option>URL</option>
                  <option>Plain Text</option>
                  <option>Email</option>
                  <option>Phone Number</option>
                  <option>Wi-Fi</option>
               </select>

                {type === 'URL' && (
                  <>
                    <label>Enter URL</label>

                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </>
                )}

                {type === 'Plain Text' && (
                  <>
                    <label>Enter text</label>

                    <input
                      type="text"
                      placeholder="Enter your text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </>
                )}

                {type === 'Email' && (
                  <>
                    <label>Email address</label>

                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </>
                )}

                {type === 'Phone Number' && (
                  <>
                    <label>Phone number</label>

                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </>
                )}

                {type === 'Wi-Fi' && (
                <>
                  <label>Network name</label>

                  <input
                    type="text"
                    placeholder="My Wi-Fi"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                  />

                  <label>Security</label>

                  <select
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value)}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                  </select>

                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Wi-Fi password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </>
              )}
              </div>

              <button
                className="continue-button"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
          </div>

          <div className="card">
            <h2>Preview</h2>

            <div className="preview-section">
              <div className="qr-box">
                <QRCodeCanvas
                  value={qrValue || ' '}
                  size={200}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
      )}

      {step === 2 && (
        <div className="design-page">
          <h1>Design your QR</h1>

          <div className="design-layout">

            <div className="qr-preview">
              <QRCodeCanvas
                value={qrValue || ' '}
                size={size}
                fgColor={foreground}
                bgColor={background}
              />
            </div>

            <div className="design-controls">

              <h2>Customize</h2>

              <div className="presets">

                {!customizing ? (
                  <>
                    <h3>Choose a theme</h3>

                    <div className="preset-grid">
                      {presets.map((preset) => (
                        <button
                          key={preset.name}
                          className="preset"
                          onClick={() => {
                            if (preset.custom) {
                              setCustomizing(true)
                            } else {
                              setForeground(preset.foreground)
                              setBackground(preset.background)
                            }
                          }}
                        >
                          <div
                            className="preset-preview"
                            style={{
                              backgroundColor: preset.custom
                                ? '#f3e9ed'
                                : preset.foreground
                            }}
                          >
                            {preset.custom && '🎨'}
                          </div>

                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Customize your QR</h3>

                    <div className="custom-options">

                      <div className="custom-color">
                        <label>QR Color</label>

                        <input
                          type="color"
                          value={foreground}
                          onChange={(e) => setForeground(e.target.value)}
                        />
                      </div>

                      <div className="custom-color">
                        <label>Background</label>

                        <input
                          type="color"
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                        />
                      </div>

                    </div>

                    <button
                      className="back-to-presets"
                      onClick={() => setCustomizing(false)}
                    >
                      ← Back to presets
                    </button>
                  </>
                )}

              </div>

              <div className="customization">
                <label>
                  QR Size: {size}px
                </label>

                <input
                  type="range"
                  min="100"
                  max="275"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="design-buttons">
            <button onClick={() => setStep(1)}>
              ← Back
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App