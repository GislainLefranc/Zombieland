import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import { UsefulInformation } from "../components/UsefulInformation/UsefulInformation";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";
import Error404 from "../Pages/Error404";
import Error403 from "../Pages/Error403";
import Activity from "../Pages/Activity";
import Activities from "../Pages/Activities";
import Profil from "../Pages/Profil";
import Register from "../Pages/Register";
import BackOfficeActivities from "../Pages/BackOfficeActivities";
import BackOfficeDashboard from "../Pages/BackOfficeDashboard";
import BackOfficeReservations from "../Pages/BackOfficeReservations";
import ProtectedRoute from "../components/ProtectedRoute";
import UserReservation from "../Pages/Booking";
import BackOfficeUser from "../Pages/BackOfficeUser";
import ForgotPassword from '../Pages/ForgotPassword';
import ResetPassword from "../Pages/ResetPassword";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <Error404 />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "/activities",
				element: <Activities />,
			},
			{
				path: "/bookings",
				element: <UserReservation />,
			},
			{
				path: "/aboutus",
				element: <HomePage />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{ 
				path:"/forgot-password",
				element: <ForgotPassword />,
			},
			{
				path: "/reset-password",
				element: <ResetPassword />,
			},
			{
				path: "/activity",
				element: <Activity />,
			},
			{
				path: "/user/:userId",
				element: (
					<>
					{console.log("Route protégée /user/:userId tentée")}
					<ProtectedRoute requiredRole={2}>
						<Profil />
					</ProtectedRoute>
					</>
				),
			},
			{
				path: "/informations-utiles",
				element: <UsefulInformation />,
			},
			// Routes administratives protégées
			{
				path: "/adminactivities",
				element: (
					<ProtectedRoute requiredRole={3}>
						<BackOfficeActivities />
					</ProtectedRoute>
				),
				errorElement: <Error403 />,
			},
			{
				path: "/admindashboard",
				element: (
					<ProtectedRoute requiredRole={3}>
						<BackOfficeDashboard />
					</ProtectedRoute>
				),
				errorElement: <Error403 />,
			},
			{
				path: "/adminreservations",
				element: (
					<ProtectedRoute requiredRole={3}>
						<BackOfficeReservations />
					</ProtectedRoute>
				),
				errorElement: <Error403 />,
			},
			{
				path: "/adminuser",
				element: (
					<ProtectedRoute requiredRole={3}>
						<BackOfficeUser />
					</ProtectedRoute>
				),
				errorElement: <Error403 />, 
			},
		],
	},
	{
		path: "/403",
		element: <Error403 />,
	},
]);

export default router;
