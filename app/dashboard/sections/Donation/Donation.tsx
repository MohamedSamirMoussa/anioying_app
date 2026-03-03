import {  IDonateSlice } from "@/app/Components/Donate/Donate";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import {

  faCalendarAlt,
  faUser,
  faDollar,
  faDonate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const Donations = ({ donations, totalRevenue }: any) => {

  const { activeServer } = useSelector((s: RootState) => s.theme);
  const currentTheme = themes[activeServer];
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
        <div className="flex items-center gap-5">
          <div
            className="w-14 h-14 flex justify-center items-center rounded-2xl text-2xl shadow-lg transition-transform hover:scale-110"
            style={{ background: currentTheme.gradient }}
          >
            <FontAwesomeIcon icon={faDonate} className="text-white" />
          </div>
          <div>
            <p className="text-3 shadow-sm font-black uppercase tracking-tight">
              Management
            </p>
            <h2 className="text-4xl font-extrabold text-white">
              All Donations
            </h2>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-white/50 text-sm">Total Donations</p>
          <p className="text-2xl font-mono font-bold text-white">
            {totalRevenue} $
          </p>
        </div>
      </div>

      {/* Users List Container */}
      <div className="overflow-hidden bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/70 uppercase text-xs tracking-widest font-bold">
                <th className="px-8 py-5">Donator Info</th>
                <th className="px-8 py-5">Donated Date</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Currency</th>
                <th className="px-8 py-5">Minecraft's user</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {donations?.map((donate:IDonateSlice) => {
                const isMe = donate._id === currentUser?._id;

                return (
                  <tr
                    key={donate._id}
                    className="group hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    {/* User Info Column */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-white/10 ${isMe ? "ring-2 ring-offset-2 ring-offset-black ring-blue-500" : ""}`}
                          style={{
                            background: isMe
                              ? currentTheme.gradient
                              : "rgba(255,255,255,0.1)",
                          }}
                        >
                          {donate.payerUsername?.given_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold flex items-center gap-2">
                            {`${donate.payerUsername?.given_name} ` +
                              donate.payerUsername?.surname}
                            {isMe && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                                YOU
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-xs opacity-40"
                        />
                        {new Date(donate?.createdAt as Date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </td>
                    {/* Role Column */}
                    <td className="px-8 py-5">
                      <div className="flex items-center capitalize gap-2 text-white/60 text-sm">
                        <FontAwesomeIcon
                          icon={faDollar}
                          className="text-xs opacity-40"
                        />
                        {donate.amount}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center capitalize gap-2 text-white/60 text-sm">
                        <FontAwesomeIcon
                          icon={faDollar}
                          className="text-xs opacity-40"
                        />
                        {donate?.currency}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-8 py-5">
                      <div className="flex items-center capitalize gap-2 text-white/60 text-sm">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-xs opacity-40"
                        />
                        {donate?.payerMCusername || "Not Entered"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center capitalize gap-2 text-white/60 text-sm">
                        {donate.status}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {(!donations || donations.length === 0) && (
            <div className="py-20 text-center text-white/30 font-medium">
              No donations found .
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;
