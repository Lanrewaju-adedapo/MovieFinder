import HomePage from "./Pages/HomePage"
import FindMovie from "./Pages/FineMovie"
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
        <Route path="/" element={<HomePage/>} />
        <Route path="/find-movie" element={<FindMovie/>} />
    </>
  )
)

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
