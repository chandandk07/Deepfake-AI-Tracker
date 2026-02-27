import { useEffect, useRef, useState } from 'react';

/** Fires a callback when element enters the viewport */
export function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return [ref, inView];
}

/** Animated counter from 0 → target when inView */
export function useCounter(target, inView, duration = 2000, decimals = 0) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((eased * target).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, target, duration, decimals]);

    return decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
}
