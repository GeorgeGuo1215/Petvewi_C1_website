"use client";

import * as React from "react";

let lockCount = 0;
let previousOverflow = "";

export function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
