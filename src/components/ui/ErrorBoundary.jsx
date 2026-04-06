import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.mini) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl h-full w-full">
            <span className="material-symbols-outlined text-red-500 mb-2" style={{ fontSize: '32px' }}>error</span>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400 font-headline uppercase tracking-wider">Falha na renderização</h3>
            <p className="text-xs text-red-600/80 dark:text-red-500/60 mt-1 max-w-[200px]">Ocorreu um problema ao carregar este componente.</p>
            <button
              onClick={this.handleReset}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold font-headline uppercase tracking-widest rounded-lg transition-all"
            >
              Tentar novamente
            </button>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f2f4f6] dark:bg-slate-950 p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl shadow-blue-500/10 border border-[#e0e3e5] dark:border-slate-800 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-red-600 dark:text-red-500" style={{ fontSize: '40px' }}>warning</span>
            </div>
            
            <h1 className="text-2xl font-bold text-[#191c1e] dark:text-slate-50 font-headline mb-3">Ops! Algo deu errado.</h1>
            <p className="text-[#515f74] dark:text-slate-400 mb-8 max-w-[300px] mx-auto text-sm leading-relaxed">
              A aplicação encontrou um erro inesperado. Não se preocupe, seus dados estão seguros.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-2xl text-sm font-bold font-headline transition-all shadow-lg shadow-[#004ac6]/20"
              >
                Recarregar aplicação
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-3.5 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-[#515f74] dark:text-slate-400 rounded-2xl text-sm font-medium transition-all"
              >
                Tentar continuar
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left">
                <p className="text-[10px] font-bold text-[#737686] dark:text-slate-500 uppercase tracking-widest mb-2">Detalhes do erro</p>
                <pre className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-[10px] font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32 border border-red-100 dark:border-red-900/20">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
