-- Enable realtime for schedules table so all clients get live updates
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
