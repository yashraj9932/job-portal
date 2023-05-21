import React from "react";
import { Button, Card, Typography } from "@mui/material";
import jobsData from "./jobsData";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const candidate = {
  _id: "6469a203f5d44446b40dea28",
  name: "Yash Raj",
  email: "yash@yash.com",
  skills: ["GraphQL", "HTML", "CSS"],
  createdAt: "2023-05-21T04:45:55.701Z",
  jobsApplied: [
    {
      job: {
        _id: "6469c0fb93dfe1b1d9551ad5",
        title: "Full Stack Developer",
        description: "Create full stack applications",
        recruiter: "6469b3869ead9277981efe16",
        submissions: ["6469a203f5d44446b40dea28"],
        createdAt: "2023-05-21T06:58:03.097Z",
        __v: 0,
      },
      status: false,
      _id: "6469c3fd77b19da737b43766",
    },
    {
      job: {
        _id: "6469c0fb93dfe1b1d9551ad5",
        title: "Full Stack Developer",
        description: "Create full stack applications",
        recruiter: "6469b3869ead9277981efe16",
        submissions: ["6469a203f5d44446b40dea28"],
        createdAt: "2023-05-21T06:58:03.097Z",
        __v: 0,
      },
      status: false,
      _id: "6469c42f26083a8ec1f10fbc",
    },
  ],
  __v: 0,
  resume: "pdf_6469a203f5d44446b40dea28.pdf",
};

const Home = () => {
  const { _id, name, email, skills, jobsApplied, resume } = candidate;
  return (
    <div>
      <Card
        style={{
          width: "50vw",
          margin: "50px auto",
          padding: 20,
          borderRadius: 20,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Typography align="center" variant="h5">
          Candidate Details
        </Typography>
        <Typography>Name: {name}</Typography>
        <Typography>Email: {email}</Typography>
        <Typography>Skills: {skills.join(", ")}</Typography>

        <Typography variant="h6" style={{ marginTop: 10 }}>
          Jobs
        </Typography>

        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {jobsData.map((job) => {
            return (
              <ListItem>
                <ListItemAvatar style={{ marginRight: "25px" }}>
                  {job.submissions.includes(_id) ? (
                    <Typography> Applied</Typography>
                  ) : (
                    <Button onClick={() => {}}>Apply</Button>
                  )}
                </ListItemAvatar>
                <ListItemText primary={job.title} secondary={job.description} />
              </ListItem>
            );
          })}
        </List>
      </Card>
    </div>
  );
};

export default Home;
