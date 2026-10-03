import { useRef, useState } from 'react'
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
  const [errorCorrection, setErrorCorrection] = useState('M')
  const [margin, setMargin] = useState(4)

  const [step, setStep] = useState(1)
  const [customizing, setCustomizing] = useState(false)
  const [centerImage, setCenterImage] = useState(null)
  const qrCanvasRef = useRef(null)
  const [error, setError] = useState('')

  const [recentQRs, setRecentQRs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentQRs')) || []
    } catch {
      return []
    }
  })

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

  const downloadQR = () => {
    saveRecentQR()
      const canvas = qrCanvasRef.current

      if (!canvas) return

      const url = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      link.download = 'qr-code.png'
      link.href = url
      link.click()
    }

    const copyQR = async () => {
      const canvas = qrCanvasRef.current

      if (!canvas) return

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      if (!blob) return

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])

        alert('QR code copied!')
      } else {
        alert('Copying images is not supported in this browser.')
      }
    }

    const validateInput = () => {
      if (type === 'URL') {
        if (!text.trim()) {
          setError('Please enter a URL.')
          return false
        }

        try {
          const url = new URL(text)

          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            setError('Please enter a valid URL starting with http:// or https://')
            return false
          }
        } catch {
          setError('Please enter a valid URL.')
          return false
        }
      }

      if (type === 'Plain Text') {
        if (!text.trim()) {
          setError('Please enter some text.')
          return false
        }
      }

      if (type === 'Email') {
        if (!text.trim()) {
          setError('Please enter an email address.')
          return false
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(text)) {
          setError('Please enter a valid email address.')
          return false
        }
      }

      if (type === 'Phone Number') {
        if (!text.trim()) {
          setError('Please enter a phone number.')
          return false
        }

        const phone = text.replace(/[\s()-]/g, '')

        if (!/^\+?\d{7,15}$/.test(phone)) {
          setError('Please enter a valid phone number.')
          return false
        }
      }

      if (type === 'Wi-Fi') {
        if (!wifiName.trim()) {
          setError('Please enter the Wi-Fi network name.')
          return false
        }

        if (wifiSecurity !== 'nopass' && !wifiPassword.trim()) {
          setError('Please enter the Wi-Fi password.')
          return false
        }
      }

      setError('')
      return true
    }

    const getContrastRatio = (color1, color2) => {
  const getLuminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const convert = (value) =>
      value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4)

    return (
      0.2126 * convert(r) +
      0.7152 * convert(g) +
      0.0722 * convert(b)
    )
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

const contrastRatio = getContrastRatio(foreground, background)

const showContrastWarning = contrastRatio < 3
const showLogoWarning = centerImage && errorCorrection === 'L'
const showSizeWarning = centerImage && size < 150
const showMarginWarning = margin < 2

const saveRecentQR = () => {
  const qrData = {
    id: Date.now(),
    type,
    text,
    wifiName,
    wifiPassword,
    wifiSecurity,
    size,
    foreground,
    background,
    errorCorrection,
    margin,
    centerImage
  }

  const updatedQRs = [
    qrData,
    ...recentQRs.filter(
      (qr) =>
        qr.type !== type ||
        qr.text !== text ||
        qr.wifiName !== wifiName
    )
  ].slice(0, 6)

  setRecentQRs(updatedQRs)
  localStorage.setItem('recentQRs', JSON.stringify(updatedQRs))
}

  return (
    <>
      {step === 1 && (
        <div className="app">
          <div className="container">

            <div className="header">
              <h1>QR Studio</h1>
              <p>Create your own customizable QR code</p>
            </div>

            <div className="content">

              <div className="card">
                <h2>Create</h2>

                <div className="input-section">

                  <label>QR Type</label>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
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
                {error && <p className="error-message">{error}</p>}
                <button
                  className="continue-button"
                  onClick={() => {
                    if (validateInput()) {
                      setStep(2)
                    }
                  }}
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
                  {recentQRs.length > 0 && (
  <div className="recent-section">
    <h2>Recent QR Codes</h2>

    <div className="recent-grid">
      {recentQRs.map((qr) => (
        <div className="recent-card" key={qr.id}>
          <div className="recent-info">
            <strong>{qr.type}</strong>

            <p>
              {qr.type === 'Wi-Fi'
                ? qr.wifiName
                : qr.text}
            </p>
          </div>

          <button
            onClick={() => {
              setType(qr.type)
              setText(qr.text)
              setWifiName(qr.wifiName)
              setWifiPassword(qr.wifiPassword)
              setWifiSecurity(qr.wifiSecurity)
              setSize(qr.size)
              setForeground(qr.foreground)
              setBackground(qr.background)
              setErrorCorrection(qr.errorCorrection)
              setMargin(qr.margin)
              setCenterImage(qr.centerImage)
              setCustomizing(false)
              setStep(2)
            }}
          >
            Reuse
          </button>
        </div>
      ))}
    </div>
  </div>
)}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="design-page">

          <h1>Design your QR</h1>

          <div className="qr-preview">
            <QRCodeCanvas
              ref={qrCanvasRef}
              value={qrValue || ' '}
              size={size}
              fgColor={foreground}
              bgColor={background}
              level={errorCorrection}
              marginSize={margin}
              imageSettings={
                centerImage
                  ? {
                      src: centerImage,
                      height: 40,
                      width: 40,
                      excavate: true
                    }
                  : undefined
              }
            />
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

          <div className="qr-settings">
            <div className="qr-setting">
              <label>Error Correction</label>

              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value)}
              >
                <option value="L">Low (L)</option>
                <option value="M">Medium (M)</option>
                <option value="Q">Quartile (Q)</option>
                <option value="H">High (H)</option>
              </select>
            </div>

            <div className="qr-setting">
              <label>Margin: {margin}</label>

              <input
                type="range"
                min="0"
                max="8"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
            </div>
          </div>
              {(showContrastWarning ||
  showLogoWarning ||
  showSizeWarning ||
  showMarginWarning) && (
  <div className="scan-warning">
    <strong>⚠ Scan reliability warning</strong>

    {showContrastWarning && (
      <p>
        The QR color and background have low contrast. This may make the QR
        code difficult to scan.
      </p>
    )}

    {showLogoWarning && (
      <p>
        A center image with Low error correction may reduce scan reliability.
        Consider using Q or H.
      </p>
    )}

    {showSizeWarning && (
      <p>
        A small QR code with a center image may be harder to scan.
      </p>
    )}

    {showMarginWarning && (
      <p>
        A very small margin may reduce scan reliability. A margin of 4 or more
        is recommended.
      </p>
    )}
  </div>
)}
          <div className="design-options">

            <div className="theme-section">

              <h2>Select a theme</h2>

              {!customizing ? (
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


            <div className="image-section">

              <h2>Select a center image</h2>

              <div className="image-grid">

                <button
                  className={`image-option ${
                    centerImage === null ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage(null)}
                >
                  <div className="image-preview none-image">
                    —
                  </div>
                  <span>None</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/lavender.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/lavender.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/lavender.svg"
                      alt="Lavender"
                    />
                  </div>
                  <span>Lavender</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/sage.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/sage.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/sage.svg"
                      alt="Sage"
                    />
                  </div>
                  <span>Sage</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/ocean.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/ocean.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/ocean.svg"
                      alt="Ocean"
                    />
                  </div>
                  <span>Ocean</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/cherry.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/cherry.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/cherry.svg"
                      alt="Cherry"
                    />
                  </div>
                  <span>Cherry</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/mocha.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/mocha.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/mocha.svg"
                      alt="Mocha"
                    />
                  </div>
                  <span>Mocha</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/sunset.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/sunset.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/sunset.svg"
                      alt="Sunset"
                    />
                  </div>
                  <span>Sunset</span>
                </button>


                <button
                  className={`image-option ${
                    centerImage === '/icons/midnight.svg' ? 'selected' : ''
                  }`}
                  onClick={() => setCenterImage('/icons/midnight.svg')}
                >
                  <div className="image-preview">
                    <img
                      src="/icons/midnight.svg"
                      alt="Midnight"
                    />
                  </div>
                  <span>Midnight</span>
                </button>


                <button
                  className="image-option"
                  onClick={() =>
                    document.getElementById('image-upload').click()
                  }
                >
                  <div className="image-preview upload-image">
                    ↑
                  </div>

                  <span>Upload your own</span>
                </button>


                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0]

                    if (file) {
                      setCenterImage(URL.createObjectURL(file))
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={downloadQR}>Download QR</button>
            <button onClick={copyQR}>Copy QR</button>
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