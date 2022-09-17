import { useEffect, useState, useRef } from 'react';

type Props = {
  numbersColor?: string,
  secondColor?: string,
  inActiveColor?: string,
  dotsColor?: string,
  width?: string,
  height?: string,
  fontSize?: string,
}

export default function (props: Props) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D  | null>(null)
  const {
    numbersColor = '#0D47A1',
    secondColor = '#004D40',
    inActiveColor = 'rgba(0, 0, 0, 0.5)',
    dotsColor = '#1565C0',
    dotsColorFaded = '#1976D2',
    width = '210px',
    height = '72px',
    fontSize = '14px',
  } = { ...props };
  let drawInterval: NodeJS.Timer;  

  useEffect(() => {
    if (canvas.current) {
      setContext(canvas.current?.getContext('2d'));
    }
  }, [canvas]);

  useEffect(() => {
    if (context) {
      drawInterval = setInterval(drawTime, 1000);
    }
    return () => {
      clearInterval(drawInterval);
    }
  }, [context])


  const getNumberArray = (digit: number): number[] => {
    return [
      [0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14],
      [10, 11, 12, 13, 14],
      [0, 5, 10, 11, 12, 7, 2, 3, 4, 9, 14],
      [0, 2, 4, 5, 5, 7, 9, 10, 11, 12, 13, 14],
      [0, 1, 2, 7, 10, 11, 12, 13, 14],
      [0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 14],
      [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13, 14],
      [0, 5, 10, 11, 12, 13, 14],
      [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14],
      [0, 1, 2, 5, 7, 10, 11, 12, 13, 14],
    ][digit];
  };

  const clearCanvas = () => {
    if (context && canvas.current) {
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.current.width, canvas.current.height);
    }
  };

  const getNumbers = (time: number[]) => {
    return time.map((t, i) => {
      return getNumberArray(t).map((n) => n + 15 * i);
    });
  };

  const getTime = (date: Date): number[] => {
    const hours = date.getHours().toString().split('');
    const mins = date.getMinutes().toString().split('');

    return [
      hours.length === 1 ? 0 : Number(hours[0]),
      hours.length === 1 ? Number(hours[0]) : Number(hours[1]),
      mins.length === 1 ? 0 : Number(mins[0]),
      mins.length === 1 ? Number(mins[0]) : Number(mins[1]),
    ];
  };

  const extraSpace = (index: number): number => {
    if (index > 44) {
      return 28;
    }

    if (index > 29) {
      return 24;
    }

    if (index > 14) {
      return 4;
    }

    return 0;
  };

  const setStyleSecond = (): void => {
    if (context) {
      context.fillStyle = secondColor;
      context.font = `400 ${fontSize} Arial`;
    }
  };

  const setStyleMinute = (): void => {
    if (context) {
      context.fillStyle = numbersColor;
      context.font = `700 ${fontSize} Arial`;
    }
  };

  const setNonActive = (): void => {
    if (context) {
      context.fillStyle = inActiveColor;
      context.font = `400 ${fontSize} Arial`;
    }
  };

  const drawCircle = (on: boolean): void => {
    if (context) {
      const color = on ? dotsColor : dotsColorFaded;
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 1;
  
      context.beginPath();
      context.arc(103, 22, 5, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
  
      context.beginPath();
      context.arc(103, 48, 5, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    }
  };

  const drawTime = () => {
    if (!context) {
      console.error('No context');
      return;
    }

    const date = new Date();

    clearCanvas();

    const time = getTime(date);
    const numbersToDraw = getNumbers(time);
    const second = date.getSeconds();
    for (let index = 0; index < 60; index++) {
      if (second === index) {
        setStyleSecond();
      } else if (numbersToDraw.some((number) => number.indexOf(index) >= 0)) {
        setStyleMinute();
      } else {
        setNonActive();
      }

      let addSomeSpace = extraSpace(index);
      context.fillText(
        index < 10 ? `0${index}` : index.toString(),
        Math.floor(index / 5) * 15 + addSomeSpace,
        13 * ((index % 5) + 1)
      );
    }

    drawCircle(second % 2 === 0);
  };

  return (
    <canvas ref={canvas} width={width} height={height} />
  )
}

