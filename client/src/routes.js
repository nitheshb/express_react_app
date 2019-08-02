import Index from "./views/Index.jsx";
import Profile from "./views/examples/Profile.jsx";
import AddPlayer from "./views/addPlayer.jsx";
import AddTeam from "./views/addTeam.jsx";
import matchSchedules from "./views/showTodaySchedules.jsx";
import myFitureMaker from "./views/myFixtureMaker.jsx";
import AddFixtures from "./views/addFixtures.jsx";
import Maps from "./views/examples/Maps.jsx";
import Register from "./views/examples/Register.jsx";
import Login from "./views/examples/Login.jsx";
import Tables from "./views/examples/Tables.jsx";
import Icons from "./views/examples/Icons.jsx";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/today-matches",
    name: "Today Match Schedules",
    icon: "ni ni-calendar-grid-58 text-blue",
    component: matchSchedules,
    layout: "/admin"
  },
  {
    path: "/myFixture-maker",
    name: "Add New Fixture",
    icon: "ni ni-trophy text-blue",
    component: myFitureMaker,
    layout: "/admin"
  },
  {
    path: "/add-fixtures",
    name: "Add Fixtures",
    icon: "ni ni-single-02 text-yellow",
    component: AddFixtures,
    layout: "/admin"
  },
  {
    path: "/add-player",
    name: "Add Player",
    icon: "ni ni-single-02 text-yellow",
    component: AddPlayer,
    layout: "/admin"
  },
  {
    path: "/add-team",
    name: "Add Team",
    icon: "ni ni-single-02 text-yellow",
    component: AddTeam,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
