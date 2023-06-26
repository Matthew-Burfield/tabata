import type { V2_MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect, useReducer, useState } from "react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Stretching Tabata" },
    {
      name: "description",
      content: "A tabata timer for Matt to use for his stretching routine",
    },
  ];
};

type Tabata = TabataStage[];
type TabataStageTitle = "Left side" | "Right side" | "Rest";
type TabataStage = {
  title: TabataStageTitle;
  maxCount: number;
};

function reducer(
  state: { stage: number; secondsSinceStart: number },
  action:
    | { type: "TICK"; value: number }
    | { type: "NEXT STAGE" }
    | { type: "RESET" }
) {
  console.log({ state });
  switch (action.type) {
    case "TICK": {
      return {
        ...state,
        secondsSinceStart: action.value,
      };
    }
    case "NEXT STAGE": {
      return {
        stage: state.stage + 1,
        secondsSinceStart: 0,
      };
    }
    case "RESET": {
      return {
        stage: 0,
        secondsSinceStart: 0,
      };
    }
    default: {
      return state;
    }
  }
}

function useTabata() {
  const [startTime, setStartTime] = useState(() => new Date());
  const [state, dispatch] = useReducer(reducer, {
    stage: 0,
    secondsSinceStart: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const diffInSeconds =
        (currentDate.getTime() - startTime.getTime()) / 1000;
      dispatch({ type: "TICK", value: Math.floor(diffInSeconds) });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  useEffect(() => {
    if (state.stage > tabata.length) {
      resetStartTime();
      dispatch({ type: "RESET" });
    }
    if (state.secondsSinceStart > tabata[state.stage].maxCount) {
      resetStartTime();
      dispatch({ type: "NEXT STAGE" });
    }
  }, [state.secondsSinceStart, state.stage]);

  function resetStartTime() {
    setStartTime(() => new Date());
  }

  function startTabata() {}

  function stopTabata() {}

  function resetTabata() {}

  function togglePause() {}

  return {
    ...tabata[state.stage],
    ...state,
    togglePause: () => void 0,
  };
}

const tabata: Tabata = [
  {
    title: "Left side",
    maxCount: 3,
  },
  {
    title: "Right side",
    maxCount: 3,
  },
  {
    title: "Left side",
    maxCount: 3,
  },
  {
    title: "Right side",
    maxCount: 3,
  },
];

export default function Index() {
  const {
    title,
    maxCount,
    secondsSinceStart: currentCount,
    togglePause,
  } = useTabata();
  const navigate = useNavigate();

  function navigateHome() {
    navigate("/");
  }

  function toggleTabataPause() {
    togglePause();
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>{title}</h1>
      <h2>
        {currentCount}/{maxCount}
      </h2>
      <button onClick={navigateHome}>Reset</button>
      <button onClick={toggleTabataPause}>Pause/Play</button>
    </div>
  );
}
