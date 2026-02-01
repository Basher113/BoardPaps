import Board from "./pages/board/Board"
import Root from "./pages/root/Root"


export const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "boards",
        element: <Board />
      }
    ]
  },

]