import React from "react";
import { Button, Card, Typography } from "@mui/material";
import jobsData from "./jobsData";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import recruiterData from "./recruiterData";

const Home = () => {
  const { _id, name, email, jobs } = recruiterData;
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
          Recruiter Details
        </Typography>
        <Typography>Name: {name}</Typography>
        <Typography>Email: {email}</Typography>

        <Typography variant="h6" style={{ marginTop: 10 }}>
          Jobs
        </Typography>

        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {jobs.map((job) => {
            return (
              <ListItem>
                <ListItemAvatar>{job.submissions.length}</ListItemAvatar>
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
