import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { C } from './styles/tokens'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh', 
          background: C.base, 
          color: C.textPrimary,
          padding: 24
        }}>
          <div style={{ 
            maxWidth: 500, 
            background: C.card, 
            border: `1px solid ${C.border}`, 
            borderRadius: 20, 
            padding: 40,
            textAlign: 'center'
          }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: 'rgba(255,45,45,0.1)', 
              border: `2px solid ${C.p1}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <AlertTriangle size={40} color={C.p1} />
            </div>

            <h1 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: 24, 
              fontWeight: 700, 
              color: C.textPrimary,
              marginBottom: 12
            }}>
              Something Went Wrong
            </h1>

            <p style={{ 
              fontSize: 14, 
              color: C.textSecondary, 
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              OptiSense HMI encountered an unexpected error. This has been logged for debugging.
              Try reloading the page to continue.
            </p>

            {this.state.error && (
              <details style={{ 
                marginBottom: 24, 
                textAlign: 'left',
                background: C.elevated,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 16
              }}>
                <summary style={{ 
                  fontSize: 12, 
                  color: C.textTertiary, 
                  cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: 8
                }}>
                  Error Details (for debugging)
                </summary>
                <pre style={{ 
                  fontSize: 11, 
                  color: C.p2, 
                  fontFamily: 'JetBrains Mono, monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              type="button"
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: C.accent,
                color: C.base,
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 160ms'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#00BFAA'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,170,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.accent
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <RefreshCw size={16} />
              Reload Application
            </button>

            <p style={{ 
              fontSize: 11, 
              color: C.textTertiary, 
              marginTop: 24 
            }}>
              If this issue persists, check the browser console (F12) for more details.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
