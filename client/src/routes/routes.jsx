import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		// errorElement: <NotFound />,
	},
	// {
	// 	path: "shop",
	// 	element: <Shop />,
	// },
	// {
	// 	path: "product/:productId",
	// 	element: <ProductDetails />,
	// },
	// {
	// 	path: "cart",
	// 	element: <Cart />,
	// },
]);

export default router;