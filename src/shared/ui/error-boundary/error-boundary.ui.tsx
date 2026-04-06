import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { Component, type ReactNode } from 'react'
import { TbAlertCircle } from 'react-icons/tb'

type ErrorBoundaryFallbackProps = {
  error: Error | null
  reset: () => void
}

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode | ((props: ErrorBoundaryFallbackProps) => ReactNode)
  title?: string
  message?: string
  resetLabel?: string
  onError?: (error: Error, errorInfo: unknown) => void
}

type ErrorBoundaryState = {
  error: Error | null
}

function DefaultErrorFallback({
  title = 'Что-то пошло не так',
  message = 'Во время отображения страницы произошла ошибка. Попробуйте повторить действие.',
  resetLabel = 'Повторить',
  reset
}: {
  title?: string
  message?: string
  resetLabel?: string
  reset: () => void
}) {
  return (
    <Alert
      color="red"
      radius="lg"
      title={title}
      icon={<TbAlertCircle size={18} />}
    >
      <Stack gap="sm">
        <Text size="sm">{message}</Text>

        <Group>
          <Button variant="light" color="red" onClick={reset}>
            {resetLabel}
          </Button>
        </Group>
      </Stack>
    </Alert>
  )
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          reset: this.reset
        })
      }

      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <DefaultErrorFallback
          title={this.props.title}
          message={this.props.message}
          resetLabel={this.props.resetLabel}
          reset={this.reset}
        />
      )
    }

    return this.props.children
  }
}
