import { useEffect, useRef, useState } from "react";

/**
 * 要素がビューポートに入ったら true を返す共通フック
 * スクロール連動フェードイン演出に使用する
 */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px",
  }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
