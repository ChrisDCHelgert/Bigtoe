
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <AlertCircle size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Da ist etwas schiefgelaufen</h2>
                    <p className="text-gray-400 max-w-md mb-6 text-sm bg-black/30 p-4 rounded overflow-auto font-mono">
                        {this.state.error?.message || 'Unbekannter Fehler'}
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        <span>Seite neu laden</span>
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
