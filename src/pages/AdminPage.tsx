import React, { useState, useEffect } from "react";
import { useCafes } from "../hooks/useCafes";
import { addCafe, updateCafe, deleteCafe } from "../api/cafeApi";
import CafeForm from "../components/CafeForm";
import {
  Edit2,
  Trash2,
  LogOut,
  Map as MapIcon,
  Loader2,
  Plus,
} from "lucide-react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { loadKakaoMapSDK } from "../utils/mapLoader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, handleFirestoreError } from "../api/firebase";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Separator } from "../components/ui/separator";

const AdminPage: React.FC = () => {
  const { cafes, loading, refresh } = useCafes();
  const [editingCafe, setEditingCafe] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const loadStartTime = React.useRef<number | null>(null);

  // 데이터 로딩 시간 측정 (SC-002 검증)
  useEffect(() => {
    if (loading) {
      loadStartTime.current = performance.now();
    } else if (!loading && loadStartTime.current !== null) {
      const loadTime = (performance.now() - loadStartTime.current) / 1000;
      console.log(`[AdminPage] 데이터 로딩 완료: ${loadTime.toFixed(2)}초`);
      loadStartTime.current = null;
    }
  }, [loading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
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
            await setDoc(userRef, {
              email: auth.currentUser.email,
              role: "admin",
              createdAt: new Date().toISOString(),
            });
            setUserRole("admin");
          } else {
            setUserRole(userDoc.data().role);
          }
        } catch (err) {
          console.error("[AdminPage] 권한 확인 에러:", err);
          handleFirestoreError(err);
        }
      }
    };
    ensureAdminUser();
  }, [auth.currentUser]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingCafe) {
        await updateCafe(editingCafe.id, data);
      } else {
        await addCafe({ ...data, createdBy: "admin" });
      }
      setEditingCafe(null);
      refresh();
    } catch (error: any) {
      console.error("[AdminPage] 저장 실패:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteCafe(id);
      refresh();
    }
  };

  const handleCancelEdit = () => {
    setEditingCafe(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              카페 데이터 관리
            </h1>
            <p className="text-muted-foreground">
              카페 정보를 등록하고 수정할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <MapIcon className="mr-2 h-4 w-4" /> 지도 돌아가기
            </Button>
            <Button size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> 로그아웃
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section (Sticky) */}
          <div className="lg:col-span-5">
            <Card className="sticky top-8 border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  {editingCafe ? (
                    <>
                      <Edit2 className="h-5 w-5" /> 카페 정보 수정
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" /> 새 카페 등록
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CafeForm
                  initialData={editingCafe}
                  onSubmit={handleSubmit}
                  onCancel={editingCafe ? handleCancelEdit : undefined}
                />
              </CardContent>
            </Card>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>등록된 카페 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[150px]">이름</TableHead>
                        <TableHead>주소</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                              <span className="text-sm">
                                데이터를 불러오는 중...
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : cafes.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="h-24 text-center text-muted-foreground"
                          >
                            등록된 카페가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        cafes.map((cafe) => (
                          <TableRow
                            key={cafe.id}
                            className={
                              editingCafe?.id === cafe.id ? "bg-primary/5" : ""
                            }
                          >
                            <TableCell className="font-medium">
                              {cafe.name}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-muted-foreground">
                              {cafe.address}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingCafe(cafe)}
                                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(cafe.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
