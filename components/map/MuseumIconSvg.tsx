// map/museumIcon.ts のLeafletピンと同じ見た目をReactコンポーネントとして提供する。

export function MuseumIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" className={className}>
            <path
                d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z"
                fill="#e11d48"
            />
            <circle cx="16" cy="16" r="7" fill="#ffffff" />
        </svg>
    );
}

export function CollaboratedMuseumIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" className={className}>
            <path
                d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z"
                fill="#15803d"
            />
            <path
                d="M16 8.5l2.1 4.5 4.9.6-3.6 3.5.9 5-4.3-2.4-4.3 2.4.9-5-3.6-3.5 4.9-.6z"
                fill="#ffffff"
            />
        </svg>
    );
}
