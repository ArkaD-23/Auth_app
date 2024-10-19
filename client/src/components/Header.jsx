import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-slate-400">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="text-white font-bold text-2xl ml-2">My Auth</h1>
        </Link>
        <ul className="flex gap-8 mr-2 text-sm">
          <Link to="/">
            <li className="text-white">Home</li>
          </Link>
          <Link to="/about">
            <li className="text-white">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img src={currentUser.profilePicture} alt="profile" className="h-7 w-7 rounded-full object-cover"  />
            ) : (
              <li className="text-white">Signin</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
