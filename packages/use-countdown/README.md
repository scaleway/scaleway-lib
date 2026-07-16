# `@scaleway/use-countdown`

A react hook acting as a countdown timer

---

## Install

```bash
pnpm add @scaleway/use-countdown
```

## Usage

As a React hook

```tsx
import { useCountdown } from '@scaleway/use-countdown'

const Component = () => {
  const { timeLeft, startCountdown } = useCountdown(10)

  return (
    <div>
      <p>Time left: {timeLeft} seconds</p>
      <button onClick={startCountdown}>Start Countdown</button>
    </div>
  )
}
```

You can also trigger the countdown at the hook instanciation

```tsx
import { useCountdown } from '@scaleway/use-countdown'

const Component = () => {
  const { timeLeft } = useCountdown(10, true)

  return (
    <div>
      <p>Time left: {timeLeft} seconds</p>
    </div>
  )
}
```
