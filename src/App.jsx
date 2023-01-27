import { useState, useEffect, useRef } from "react";
import "./App.css";
import Timer from "./Timer";
import Controls from "./Controls";
import TimeAdjust from "./TimeAdjust";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const INITIALSTATE = { session: 25, break: 5, state: true };

function App() {
  const [state, setState] = useState(INITIALSTATE);
  const [time, setTime] = useState(1500000);
  const [running, setRunning] = useState(false);
  const timeRef = useRef(null);
  const stoppedRef = useRef(false);
  const audio = useRef(null);
  const workerRef = useRef(null);
  timeRef.current = time;

  useEffect(() => {
    if (running) return;
    setTime(state.session * MINUTE);
  }, [state]);

  useEffect(() => {
    workerRef.current = new Worker(new URL("./worker.js", import.meta.url));
    const worker = workerRef.current;
    worker.onmessage = function (message) {
      if (message.data === "End of period") {
        audio.current.play();
        setState(prevState => ({ ...prevState, state: !prevState.state }));
        return;
      }
      if (typeof message.data === "number") setTime(message.data);
    };

    return () => {
      // console.log("Terminated");
      worker.terminate();
    };
  }, []);

  function incrementSession() {
    setState(oldState => ({
      ...oldState,
      session: oldState.session >= 60 ? 60 : oldState.session + 1,
    }));

    console.log(time);
  }
  function decrementSession() {
    setState(oldState => ({
      ...oldState,
      session: oldState.session <= 1 ? 1 : oldState.session - 1,
    }));
    console.log(time);
  }
  function incrementBreak() {
    setState(oldState => ({
      ...oldState,
      break: oldState.break >= 60 ? 60 : oldState.break + 1,
    }));
    console.log(time);
  }
  function decrementBreak() {
    setState(oldState => ({
      ...oldState,
      break: oldState.break <= 1 ? 1 : oldState.break - 1,
    }));
    console.log(time);
  }

  function startTimer() {
    const worker = workerRef.current;
    const stopped = stoppedRef.current;
    if (stopped) {
      worker.postMessage("continue");
      stoppedRef.current = false;
    } else {
      worker.postMessage({
        status: "start",
        session: state.session,
        break: state.break,
        state: "Session",
      });
    }

    setRunning(prevState => !prevState);
    timeRef.current = time;
    // console.log(worker);
  }

  function stopTimer() {
    const worker = workerRef.current;
    worker.postMessage("stop");
    stoppedRef.current = true;
    setRunning(prevState => !prevState);
    // console.log(intervalRef.current);
  }

  function resetTimer() {
    const worker = workerRef.current;

    worker.postMessage("stop");
    audio.current.pause();
    audio.current.currentTime = 0;
    stoppedRef.current = false;
    setRunning(false);
    setState(INITIALSTATE);
    setTime(INITIALSTATE.session * MINUTE);
  }

  const minutes = Math.floor(time / MINUTE);
  const seconds = Math.floor((time / SECOND) % 60);
  return (
    <div className='App'>
      <header className='project-header'>25 + 5 Clock</header>
      <div className='flex'>
        <TimeAdjust
          session={state.session}
          increment={incrementSession}
          decrement={decrementSession}
          title={"Session"}
        ></TimeAdjust>
        <TimeAdjust
          session={state.break}
          increment={incrementBreak}
          decrement={decrementBreak}
          title={"Break"}
        ></TimeAdjust>
      </div>
      <Timer state={state.state} minutes={minutes} seconds={seconds}></Timer>
      <Controls
        running={running}
        start={startTimer}
        stop={stopTimer}
        reset={resetTimer}
      ></Controls>
      <audio
        ref={audio}
        id='beep'
        src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
      ></audio>
    </div>
  );
}

export default App;
