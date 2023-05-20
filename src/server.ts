import app from './app';

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`App running on http://127.0.0.1:${PORT} ...`);
});
