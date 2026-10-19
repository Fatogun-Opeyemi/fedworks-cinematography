
import React from 'react'

export default function CinematicLoader({ visible = true }) {
    return (
        <div
            className={`fw-cinematic-loader${visible ? ' is-visible' : ''}`}
            role={visible ? 'status' : undefined}
            aria-live="polite"
            aria-hidden={!visible}
            aria-label={visible ? 'Loading FEDWORKS portfolio' : undefined}
        >
            <div className="fw-loader-top">
                <span className="fw-loader-brand">FEDWORKS</span>
                <span className="fw-loader-index">
                    INDEPENDENT PICTURE MAKING
                </span>
            </div>

            <div className="fw-loader-center">
                <span className="fw-loader-eyebrow">
                    DIRECTOR OF PHOTOGRAPHY
                </span>

                <h1>
                    Every frame.
                    <br />
                    <span>Intentional.</span>
                </h1>

                <div className="fw-loader-progress" aria-hidden="true">
                    <div className="fw-loader-progress-fill" />
                </div>

                <p className="fw-loader-status">
                    PREPARING THE FRAME
                </p>
            </div>

            <div className="fw-loader-bottom">
                <span>FILM</span>
                <span className="fw-loader-separator">/</span>
                <span>IMAGE</span>
                <span className="fw-loader-separator">/</span>
                <span>STORY</span>
                <span className="fw-loader-bottom-right">
                    LAGOS · NIGERIA
                </span>
            </div>

            <style>{`
        .fw-cinematic-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          grid-template-rows: auto 1fr auto;
          padding: clamp(22px, 4vw, 54px);
          background: #111110;
          color: #f2f0eb;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 550ms cubic-bezier(.22, 1, .36, 1),
            visibility 0s linear 550ms;
        }

        .fw-cinematic-loader.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition:
            opacity 550ms cubic-bezier(.22, 1, .36, 1),
            visibility 0s;
        }

        .fw-loader-top,
        .fw-loader-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .fw-loader-brand {
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.16em;
        }

        .fw-loader-index,
        .fw-loader-eyebrow,
        .fw-loader-status,
        .fw-loader-bottom {
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.13em;
        }

        .fw-loader-index,
        .fw-loader-status {
          color: rgba(242, 240, 235, 0.52);
        }

        .fw-loader-center {
          width: 100%;
          max-width: 740px;
          align-self: center;
          justify-self: center;
          padding: 48px 0;
        }

        .fw-loader-eyebrow {
          display: block;
          margin-bottom: 26px;
          color: #a9a59d;
        }

        .fw-loader-center h1 {
          margin: 0;
          font-size: clamp(3.1rem, 9vw, 7.8rem);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: -0.075em;
        }

        .fw-loader-center h1 span {
          color: #a9a59d;
        }

        .fw-loader-progress {
          width: min(100%, 300px);
          height: 1px;
          margin-top: 44px;
          overflow: hidden;
          background: rgba(242, 240, 235, 0.18);
        }

        .fw-loader-progress-fill {
          width: 35%;
          height: 100%;
          background: #f2f0eb;
          transform: translateX(-110%);
          animation: fw-loader-sweep 1.35s
            cubic-bezier(.65, 0, .35, 1) infinite;
        }

        .fw-loader-status {
          margin: 13px 0 0;
          font-size: 0.56rem;
        }

        .fw-loader-bottom {
          justify-content: flex-start;
          color: rgba(242, 240, 235, 0.7);
          font-size: 0.58rem;
        }

        .fw-loader-separator {
          color: #9e2f2b;
        }

        .fw-loader-bottom-right {
          margin-left: auto;
          color: rgba(242, 240, 235, 0.48);
        }

        @keyframes fw-loader-sweep {
          0% {
            transform: translateX(-110%);
          }

          100% {
            transform: translateX(390%);
          }
        }

        @media (max-width: 600px) {
          .fw-loader-index {
            max-width: 120px;
            text-align: right;
            line-height: 1.7;
          }

          .fw-loader-center h1 {
            font-size: clamp(3rem, 12vw, 5rem);
          }

          .fw-loader-eyebrow {
            font-size: 0.56rem;
          }

          .fw-loader-bottom {
            flex-wrap: wrap;
            font-size: 0.52rem;
          }

          .fw-loader-bottom-right {
            width: 100%;
            margin: 10px 0 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fw-cinematic-loader {
            transition: none;
          }

          .fw-loader-progress-fill {
            animation: none;
            transform: translateX(0);
            width: 100%;
          }
        }
      `}</style>
        </div>
    )
}
