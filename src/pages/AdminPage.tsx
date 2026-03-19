import React, { useState } from "react";
import { useCafes } from "../hooks/useCafes";
import { addCafe, updateCafe, deleteCafe } from "../api/cafeApi";
import CafeForm from "../components/CafeForm";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AdminPage: React.FC = () => {
  const { cafes, loading, refresh } = useCafes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState<any>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingCafe) {
        await updateCafe(editingCafe.id, data);
      } else {
        await addCafe({ ...data, createdBy: "admin" });
      }
      setIsFormOpen(false);
      setEditingCafe(null);
      refresh();
    } catch (error) {
      console.error("Failed to save cafe:", error);
      alert("저장에 실패했습니다.");
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
          <h1 className="text-2xl font-bold text-gray-900">카페 데이터 관리</h1>
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
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    로딩 중...
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
