import React from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-100 shadow-sm p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center">
              <AlertTriangle size={30} className="text-rose-600" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

