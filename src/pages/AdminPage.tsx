import React, { useState, useEffect } from "react";
import { useCafes } from "../hooks/useCafes";
import { addCafe, updateCafe, deleteCafe } from "../api/cafeApi";
import CafeForm from "../components/CafeForm";
import { Plus, Edit2, Trash2, LogOut, Map as MapIcon, Loader2 } from "lucide-react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { loadKakaoMapSDK } from "../utils/mapLoader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../api/firebase";

const AdminPage: React.FC = () => {
  const { cafes, loading, refresh } = useCafes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadKakaoMapSDK().catch((err) => console.error("Kakao SDK 에러:", err));

    const ensureAdminUser = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            console.log("[AdminPage] 사용자가 없어 자동 생성합니다...");
            await setDoc(userRef, {
              email: auth.currentUser.email,
              role: "admin",
              createdAt: new Date().toISOString()
            });
            setUserRole("admin");
          } else {
            setUserRole(userDoc.data().role);
          }
        } catch (err) {
          console.error("[AdminPage] 권한 확인 중 치명적 오류 (네트워크 차단 의심):", err);
        }
      }
    };
    ensureAdminUser();
  }, [auth.currentUser]);

  const handleSubmit = async (data: any) => {
    console.log("[AdminPage] 저장 프로세스 시작:", data);
    try {
      if (editingCafe) {
        await updateCafe(editingCafe.id, data);
      } else {
        await addCafe({ ...data, createdBy: "admin" });
      }
      console.log("[AdminPage] 저장 성공");
      setIsFormOpen(false);
      setEditingCafe(null);
      refresh();
      alert("성공적으로 저장되었습니다.");
    } catch (error: any) {
      console.error("[AdminPage] 저장 실패 상세 로그:", error);
      if (error.message?.includes('offline')) {
        alert("현재 오프라인 상태이거나 Firestore 서버에 접속할 수 없습니다. 방화벽 설정을 확인해 주세요.");
      } else {
        alert(`저장 중 오류 발생: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteCafe(id);
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">카페 데이터 관리</h1>
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <MapIcon size={16} className="mr-1" /> 지도 돌아가기
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setEditingCafe(null);
                setIsFormOpen(true);
              }}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} className="mr-2" /> 카페 추가
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <LogOut size={18} className="mr-2" /> 로그아웃
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="mb-8">
            <CafeForm
              initialData={editingCafe}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCafe(null);
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">이름</th>
                <th className="px-6 py-4">주소</th>
                <th className="px-6 py-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Loader2 size={32} className="animate-spin mb-2 text-blue-500" />
                      <span className="text-sm font-medium">카페 목록을 불러오는 중입니다...</span>
                    </div>
                  </td>
                </tr>
              ) : cafes.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    등록된 카페가 없습니다.
                  </td>
                </tr>
              ) : (
                cafes.map((cafe) => (
                  <tr
                    key={cafe.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cafe.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{cafe.address}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingCafe(cafe);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cafe.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
