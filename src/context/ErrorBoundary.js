import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                // <div style={{
                //     minHeight: '100vh',
                //     display: 'flex',
                //     alignItems: 'center',
                //     justifyContent: 'center',
                //     backgroundColor: '#f9fafb',
                //     padding: '20px'
                // }}>
                //     <div style={{
                //         maxWidth: '500px',
                //         width: '100%',
                //         backgroundColor: 'white',
                //         borderRadius: '12px',
                //         padding: '40px',
                //         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                //         textAlign: 'center'
                //     }}>
                //         <div style={{
                //             fontSize: '48px',
                //             marginBottom: '20px'
                //         }}>
                //             😕
                //         </div>

                //         <h1 style={{
                //             fontSize: '24px',
                //             fontWeight: '600',
                //             color: '#111827',
                //             marginBottom: '12px'
                //         }}>
                //             Oops! Something went wrong
                //         </h1>

                //         <p style={{
                //             fontSize: '16px',
                //             color: '#6b7280',
                //             marginBottom: '32px',
                //             lineHeight: '1.5'
                //         }}>
                //             We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
                //         </p>

                //         <div style={{
                //             display: 'flex',
                //             gap: '12px',
                //             justifyContent: 'center',
                //             flexWrap: 'wrap'
                //         }}>
                //             <button
                //                 onClick={this.handleReset}
                //                 style={{
                //                     padding: '12px 24px',
                //                     backgroundColor: '#3b82f6',
                //                     color: 'white',
                //                     border: 'none',
                //                     borderRadius: '8px',
                //                     fontSize: '16px',
                //                     fontWeight: '500',
                //                     cursor: 'pointer',
                //                     transition: 'background-color 0.2s'
                //                 }}
                //                 onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                //                 onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                //             >
                //                 Try Again
                //             </button>

                //             <button
                //                 onClick={() => window.location.reload()}
                //                 style={{
                //                     padding: '12px 24px',
                //                     backgroundColor: '#6b7280',
                //                     color: 'white',
                //                     border: 'none',
                //                     borderRadius: '8px',
                //                     fontSize: '16px',
                //                     fontWeight: '500',
                //                     cursor: 'pointer',
                //                     transition: 'background-color 0.2s'
                //                 }}
                //                 onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                //                 onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                //             >
                //                 Reload Page
                //             </button>
                //         </div>

                //         {/* Show error details only in development */}
                //         {process.env.NODE_ENV === 'development' && this.state.error && (
                //             <details style={{
                //                 marginTop: '32px',
                //                 textAlign: 'left',
                //                 backgroundColor: '#fef2f2',
                //                 padding: '16px',
                //                 borderRadius: '8px',
                //                 border: '1px solid #fecaca'
                //             }}>
                //                 <summary style={{
                //                     cursor: 'pointer',
                //                     fontWeight: '600',
                //                     color: '#991b1b',
                //                     marginBottom: '12px'
                //                 }}>
                //                     🔧 Error Details (Dev Mode Only)
                //                 </summary>
                //                 <pre style={{
                //                     fontSize: '12px',
                //                     overflow: 'auto',
                //                     backgroundColor: '#ffffff',
                //                     padding: '12px',
                //                     borderRadius: '6px',
                //                     color: '#374151',
                //                     whiteSpace: 'pre-wrap',
                //                     wordBreak: 'break-word'
                //                 }}>
                //                     <strong>Error:</strong> {this.state.error.toString()}
                //                     {'\n\n'}
                //                     <strong>Component Stack:</strong>
                //                     {this.state.errorInfo?.componentStack}
                //                 </pre>
                //             </details>
                //         )}
                //     </div>
                // </div>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                }}>
                    <div style={{
                        maxWidth: '480px',
                        width: '100%',
                        padding: '32px'
                    }}>
                        <h1 style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#111827',
                            marginBottom: '8px'
                        }}>
                            Something went wrong
                        </h1>

                        <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '24px',
                            lineHeight: 1.5
                        }}>
                            An unexpected error occurred. Try refreshing the page. If the problem
                            continues, contact support.
                        </p>

                        <div style={{
                            display: 'flex',
                            gap: '12px'
                        }}>
                            <button
                                onClick={this.handleReset}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: '14px',
                                    backgroundColor: '#111827',
                                    color: '#ffffff',
                                    border: '1px solid #111827',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Try again
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: '14px',
                                    backgroundColor: '#ffffff',
                                    color: '#111827',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Reload page
                            </button>
                        </div>

                        {/* {process.env.NODE_ENV === 'development' && this.state.error && (
                            <pre style={{
                                marginTop: '24px',
                                padding: '12px',
                                fontSize: '12px',
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px',
                                color: '#374151',
                                overflow: 'auto'
                            }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        )} */}
                    </div>
                </div>

            );
        }

        return this.props.children;
    }
}


export const setupGlobalErrorHandlers = () => {
    if (process.env.NODE_ENV === 'development') {
        const style = document.createElement('style');
        style.innerHTML = `
            iframe[style*="position: fixed"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        const originalError = console.error;
        console.error = (...args) => {
            if (
                typeof args[0] === 'string' &&
                (args[0].includes('The above error occurred') ||
                    args[0].includes('React will try to recreate') ||
                    args[0].includes('Consider adding an error boundary'))
            ) {
                return;
            }
            originalError.apply(console, args);
        };
    }

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });

    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        event.preventDefault();
        event.stopImmediatePropagation();
    });
};

export default ErrorBoundary;