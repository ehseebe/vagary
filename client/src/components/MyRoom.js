import React, { useState, useEffect } from "react";
import axios from "axios";
import { getQuizResultsByUserId } from "./helpers/selectors";
import Tooltip from "@material-ui/core/Tooltip";
import "./LayoutMain.scss";
import "./MyRoom.scss";

export default function MyRoom({ userId }) {
  const [state, setState] = useState({
    quizzes: [],
    quizResults: [],
    quizQuestionCount: [],
    favourites: [],
  });

  useEffect(() => {
    Promise.all([
      axios.get("/quizzes"),
      axios.get("/quiz_results"),
      axios.get("/quiz-questions-count"),
      axios.get("/favourites"),
    ])
      .then((all) => {
        // console.log("FAVS: ", all[3].data);
        setState((prev) => ({
          ...prev,
          quizzes: all[0].data,
          quizResults: all[1].data,
          quizQuestionCount: all[2].data,
          favourites: all[3].data,
        }));
      })
      .catch((err) => console.log(err.message));
  }, []);

  const favs = state.favourites;
  console.log("FAVS: ", favs);

  const userQuizResults = getQuizResultsByUserId(
    Number(userId),
    state.quizzes,
    state.quizResults
  );

  // const getFavs = favs.map((fav) => {
  //   return (
  //     (city = fav.city),
  //     (landmark = fav.landmark),
  //     (description = fav.description)
  //   );
  // city: fav.city,
  // landmark: fav.landmark,
  // description: fav.description
  // });

  return (
    <div className="background--My-Room">
      <div class="main">
        <div class="card-deck">
          <div class="welcome-my-room">
            <div class="welcome-my-room-title"></div>
          </div>
          <div class="card-container">
            <div class="card-profile">
              <div class="card-title">profile</div>
              <div class="card-body">
                <button type="button" class="btn btn-outline-light">
                  edit
                </button>
              </div>
            </div>
            <div class="card-quiz">
              <div class="card-title">quiz scores</div>
              <div class="card-body">
                <div class="main-quiz-table">
                  <table class="table">
                    <thead></thead>
                    <tbody>
                      <tr>
                        {userQuizResults.map((result) => (
                          <tr key={result.id}>
                            <td class="card-text">{result.quiz}</td>{" "}
                            <td class="card-text-result">{result.result}%</td>
                          </tr>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="card-favourite">
              <div class="card-title">favourites</div>
              <div class="card-body">
                {favs.map((fav) => (
                    <p class="card-text">
                      <strong>{fav.landmark}</strong> ({fav.city})
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}