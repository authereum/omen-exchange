import React, { DOMAttributes } from 'react'
import styled from 'styled-components'

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin-bottom: 29px;
  margin-top: 8px;
`

const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% + 24px);
  margin: 0 -12px;
`

const ProgressBarDot = styled.div<{ fill: boolean }>`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  border: ${props => !props.fill && `1px solid ${props.theme.buttonPrimaryLine.borderColor}`};
  margin: 0 12px;

  &.progress-bar-dot__0 {
    background: ${props => props.fill && props.theme.progressBar.open}
  }
  &.progress-bar-dot__1 {
    background: ${props => props.fill && props.theme.progressBar.finalizing}
  }
  &.progress-bar-dot__2 {
    background: ${props => props.fill && props.theme.progressBar.arbitration}
  }
  &.progress-bar-dot__3 {
    background: ${props => props.fill && props.theme.progressBar.closed}
  }
`

const ProgressBarFill = styled.div<{ fill: boolean, fillFraction: number }>`
  height: 12px;
  width: ${props => `calc(${props.fillFraction} * 100% + 2px)`};
  margin: -1px;
  border-radius: ${props => props.fillFraction < 1 ? '' : '32px'};
  border-top-left-radius: ${props => props.fillFraction < 1 ? '32px' : ''};
  border-bottom-left-radius: ${props => props.fillFraction < 1 ? '32px' : ''};

  &.progress-bar-fill__0 {
    background: ${props => props.fill && props.theme.progressBar.open}
  }
  &.progress-bar-fill__1 {
    background: ${props => props.fill && props.theme.progressBar.finalizing}
  }
  &.progress-bar-fill__2 {
    background: ${props => props.fill && props.theme.progressBar.arbitration}
  }
`

const ProgressBarLine = styled.div`
  height: 12px;
  border-radius: 32px;
  border: ${props => `1px solid ${props.theme.buttonPrimaryLine.borderColor}`};
  flex-grow: 1;
`

const ProgressBarTitles = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const ProgressBarTitle = styled.div`
  color: ${props => props.theme.colors.textColor}
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  width: 33.333%;
  text-align: center;

  &:first-child {
    text-align: left;
    width: 16.666%;
  }
  &:last-child {
    text-align: right;
    width: 16.666%;
  }
`

enum State {
  open = 'open',
  finalizing = 'finalizing',
  arbitration = 'arbitration',
  closed = 'closed'
}

interface Props extends DOMAttributes<HTMLDivElement> {
  state: string
  creationTimestamp: Date
  resolutionTimestamp: Date
}

export const ProgressBar: React.FC<Props> = props => {
  const { creationTimestamp, resolutionTimestamp, state } = props

  const fillOpen = state === State.finalizing || state === State.arbitration || state === State.closed
  const fillFinalizing = state === State.arbitration || state === State.closed
  const fillArbitration = state === State.closed

  const openDuration = resolutionTimestamp.getTime() - creationTimestamp.getTime()
  const timeSinceOpen = new Date().getTime() - creationTimestamp.getTime()
  const openFraction = (timeSinceOpen / openDuration) > 1 ? 1 : timeSinceOpen / openDuration

  return (
    <ProgressBarWrapper>
      <ProgressBarContainer>
        <ProgressBarDot className="progress-bar-dot__0" fill={true}></ProgressBarDot>
        <ProgressBarLine>
          <ProgressBarFill className="progress-bar-fill__0" fill={true} fillFraction={openFraction}></ProgressBarFill>
        </ProgressBarLine>
        <ProgressBarDot className="progress-bar-dot__1" fill={fillOpen}></ProgressBarDot>
        <ProgressBarLine>
          <ProgressBarFill className="progress-bar-fill__1" fill={fillOpen} fillFraction={0}></ProgressBarFill>
        </ProgressBarLine>
        <ProgressBarDot className="progress-bar-dot__2" fill={fillFinalizing}></ProgressBarDot>
        {fillArbitration && (
          <>
            <ProgressBarLine>
              <ProgressBarFill className="progress-bar-fill__2" fill={fillFinalizing} fillFraction={0}></ProgressBarFill>
            </ProgressBarLine>
            <ProgressBarDot className="progress-bar-dot__3" fill={fillArbitration}></ProgressBarDot>
          </>
        )}
      </ProgressBarContainer>
      <ProgressBarTitles>
        <ProgressBarTitle>
          Open
        </ProgressBarTitle>
        <ProgressBarTitle>
          Finalizing
        </ProgressBarTitle>
        {fillArbitration && (
          <ProgressBarTitle>
            Arbitration 
          </ProgressBarTitle>
        )}
        <ProgressBarTitle>
          Closed
        </ProgressBarTitle>
      </ProgressBarTitles>
    </ProgressBarWrapper>
  )
}