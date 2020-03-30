import React, { useState, useEffect } from "react";
import {
  InputGroup,
  FormControl,
  Button,
  ListGroup,
  ButtonGroup
} from "react-bootstrap";

const ActiveTimerView = ({
  interval,
  rest,
  onStop,
  stopped,
  exercises,
  numSets
}) => {
  const [exerciseIndex, setExerciseIndex] = useState(exercises.length - 1);
  const [isActive, setIsActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(interval);
  const [pause, setPause] = useState(false);
  const [setNum, setSetNum] = useState(0);
  const speakMessage = () => {
    if (isActive) {
      const msg = new SpeechSynthesisUtterance("Rest");
      window.speechSynthesis.speak(msg);
      setIsActive(false);
      setSecondsRemaining(rest);
    } else {
      let index = exerciseIndex + 1;
      if (exerciseIndex === exercises.length - 1) {
        if (setNum === numSets) {
          const msg = new SpeechSynthesisUtterance(
            "You finished your workout! Good job!"
          );
          window.speechSynthesis.speak(msg);
          onStop();
          return;
        } else {
          setSetNum(setNum + 1);
        }
        index = 0;
      }
      setExerciseIndex(index);
      const msg = new SpeechSynthesisUtterance(exercises[index]);
      window.speechSynthesis.speak(msg);
      if (rest) {
        setIsActive(true);
      }
      setSecondsRemaining(interval);
    }
  };
  const checkTimer = () => {
    if (pause) {
      setTimeout(() => checkTimer(), 1000);
      return;
    }
    if (secondsRemaining === 1) {
      speakMessage();
    } else {
      setSecondsRemaining(remaining => remaining - 1);
    }
  };
  useEffect(() => {
    speakMessage();
  }, []);
  useEffect(() => {
    if (stopped) {
      return;
    }
    setTimeout(() => checkTimer(), 1000);
  }, [secondsRemaining, pause]);
  return (
    <div className="timer">
      <div>
        <h1>Set Number {setNum}</h1>
      </div>
      <div>
        <h1>:{secondsRemaining}</h1>
      </div>
      <h2>{!rest || isActive ? exercises[exerciseIndex] : "REST"}</h2>
      <div>
        <ButtonGroup aria-label="Timer buttons">
          <Button variant="secondary" onClick={() => setPause(!pause)}>
            {pause ? "Start" : "Pause"}
          </Button>
          <Button variant="primary" onClick={onStop}>
            Stop
          </Button>
        </ButtonGroup>
      </div>
      <style jsx>{`
        .timer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 {
          fontsize: 46px;
        }
      `}</style>
    </div>
  );
};
const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState();
  const [interval, setInterval] = useState("");
  const [rest, setRest] = useState("");
  const [numSets, setNumSets] = useState(1);
  const [started, setStarted] = useState(false);
  if (started) {
    return (
      <ActiveTimerView
        stopped={!started}
        interval={Number(interval)}
        numSets={Number(numSets)}
        rest={rest}
        onStop={() => setStarted(false)}
        exercises={exercises}
      />
    );
  }
  return (
    <div className="container">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
        crossOrigin="anonymous"
      />
      <h1>Home Workout</h1>
      <InputGroup className="mb-3">
        <FormControl
          value={currentExercise}
          onChange={e => setCurrentExercise(e.target.value)}
          placeholder="Add Exercise (ex. Squats)"
          aria-label="Exercise"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Prepend>
          <Button
            variant="primary"
            onClick={() => {
              setCurrentExercise("");
              setExercises([...exercises, currentExercise]);
            }}
          >
            Add
          </Button>
        </InputGroup.Prepend>
      </InputGroup>
      <ListGroup>
        {exercises.map(e => (
          <InputGroup className="mb-3" key={e}>
            <ListGroup.Item>{e}</ListGroup.Item>
            <InputGroup.Prepend>
              <Button
                variant="danger"
                onClick={() => {
                  setExercises(exercises.filter(exercise => exercise !== e));
                }}
              >
                X
              </Button>
            </InputGroup.Prepend>
          </InputGroup>
        ))}
      </ListGroup>
      <InputGroup className="mb-3">
        <FormControl
          value={numSets}
          onChange={e => setNumSets(e.target.value)}
          placeholder="Number of sets (ex. 3)"
          aria-label="Sets"
          aria-describedby="basic-addon2"
        />
        <FormControl
          value={interval}
          onChange={e => setInterval(e.target.value)}
          placeholder="Timer Interval in seconds (ex. 45)"
          aria-label="Interval"
          aria-describedby="basic-addon2"
        />
        <FormControl
          value={rest}
          onChange={e => setRest(e.target.value)}
          placeholder="Optional Rest Time (ex. 15)"
          aria-label="Rest"
          aria-describedby="basic-addon2"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <Button
          variant="primary"
          onClick={() => setStarted(true)}
          disabled={!exercises.length || !interval || !numSets}
        >
          Start
        </Button>
      </InputGroup>
      <style jsx>{`
        h1 {
          margin-top: 20px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Home;
