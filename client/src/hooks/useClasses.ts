import { useMemo } from 'react';
import { css } from '@emotion/css';
import { useTheme, Theme } from '@emotion/react';

const useClasses = (stylesElement: ((theme: Theme) => object)) => {
  const theme = useTheme();
  return useMemo(() => {
    const rawClasses = typeof stylesElement === 'function'
      ? stylesElement(theme)
      : stylesElement;
    const prepared: { [key: string]: string } = {};

    Object.entries(rawClasses).forEach(([key, value= {}]) => {
      prepared[key] = css(value);
    });

    return prepared;
  }, [stylesElement, theme]);
};

export default useClasses;