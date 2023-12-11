import "./App.scss";
import React, { useEffect, useState } from "react";

let url = "https://hacker-news.firebaseio.com/v0"; // for id

let idUrl = "https://hacker-news.firebaseio.com/v0/jobstories.json" // this url will array of id's of the job
let actualJobById = "https://hacker-news.firebaseio.com/v0/item/38594989.json"  // this url will give the job based on id

const App = () => {
  const [itemIds, setItemIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [currentSlice, setCurrentSlice] = useState(1);
  const lastIndex = 6;
  console.log("currentSlice", currentSlice);
  let filterJobs = jobs.slice(0, currentSlice * lastIndex);

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await fetch(`${url}/jobstories.json`);
        const data = await response.json();
        const items = data;
        setItemIds(items);
        const jobItems = await Promise.all(
          items.map((itemId) => {
            return fetch(`${url}/item/${itemId}.json`).then((res) =>
              res.json()
            );
          })  // Once all the promises are resolved then only they push to jobItems
        );
        return setJobs(jobItems);
      } catch (error) {
        console.log({ error });
      }
    };

    fetching();
  }, []);

  return (
    <main className="flexer">
      {jobs.length <= 0 ? <h3>Loading...</h3> : ""} 

      <div className="jobcard">
        {filterJobs.map((job, index) => {
          const { id, by, score, text, time, title, type, url } = job;

          return (
            <div className="card" key={id}>
              <div className="title">
                {/* <h1>id -{index}</h1> */}
                <a href={url ? url : ""} target="_blank">
                  {title}
                </a>
              </div>
              <div className="content">
                <h2>By : {by}</h2>
                <h2>Time- {new Date(time * 1000).toLocaleString()}</h2>
                <h2> score :{score}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length > 0 && (
        <div className="button">
          {jobs.length !== filterJobs.length ? (
            <button onClick={() => setCurrentSlice(currentSlice + 1)}>
              Load More ...
            </button>
          ) : (
            <h2>No more Jobs</h2>
          )}
        </div>
      )}
    </main>
  );
};

export default App;
