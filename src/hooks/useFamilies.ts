import useSWR from "swr";
import { type CreateFamilyData, fetcher, type JoinFamilyData } from "../services/api";
import type { FamilyMember, FamilyMembersResponse } from "../types";

// 通用API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// 邀请码返回数据类型
export interface InvitationCodeResponse {
  success: boolean;
  data: {
    invitationCode: string;
  };
}

export interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

// Families相关hooks
export const useFamilies = (): {
  currentFamily: any | null;
  currentFamilyError: ErrorResponse | undefined;
  familyMembers: FamilyMember[];
  familyMembersError: ErrorResponse | undefined;
  invitationCode: string | undefined;
  invitationCodeError: Error | undefined;
  createFamily: (data: CreateFamilyData) => Promise<any>;
  joinFamily: (data: JoinFamilyData) => Promise<any>;
  leaveFamily: () => Promise<any>;
  deleteFamily: () => Promise<any>;
  refreshCurrentFamily: (data?: any) => Promise<any>;
  refreshFamilyMembers: (data?: any) => Promise<any>;
} => {
  // 获取当前家庭信息
  const {
    data: familyResponse,
    error: currentFamilyError,
    mutate: mutateCurrentFamily,
  } = useSWR<ApiResponse<any>>("/families/current", fetcher);

  // 直接从响应的data字段获取家庭信息
  const currentFamily = familyResponse?.data || null;

  // 获取家庭成员
  const {
    data: familyMembersResponse,
    error: familyMembersError,
    mutate: mutateFamilyMembers,
  } = useSWR<FamilyMembersResponse>("/families/members", fetcher);

  // 提取成员数组数据
  const familyMembers = familyMembersResponse?.data || [];
  // 获取邀请码
  // 返回：
  // {"success":true,"data":{"invitationCode":"CEE5AE4594F8"}}
  const { data: invitationCodeResponse, error: invitationCodeError } =
    useSWR<InvitationCodeResponse>("/families/invitation-code", fetcher);

  // 提取直接的邀请码字符串
  const invitationCode = invitationCodeResponse?.data?.invitationCode;

  // 创建家庭
  const createFamily = async (data: CreateFamilyData) => {
    const result = await fetcher("/families", "POST", data);
    mutateCurrentFamily(); // 重新获取当前家庭信息
    return result;
  };

  // 加入家庭
  const joinFamily = async (data: JoinFamilyData) => {
    const result = await fetcher("/families/join", "POST", data);
    mutateCurrentFamily(); // 重新获取当前家庭信息
    return result;
  };

  // 退出家庭
  const leaveFamily = async () => {
    const result = await fetcher("/families/leave", "POST");
    mutateCurrentFamily({ success: false, data: null }); // 清除当前家庭信息
    return result;
  };

  // 删除家庭
  const deleteFamily = async () => {
    const result = await fetcher("/families", "DELETE");
    mutateCurrentFamily({ success: false, data: null }); // 清除当前家庭信息
    return result;
  };

  return {
    currentFamily,
    currentFamilyError,
    familyMembers,
    familyMembersError,
    invitationCode,
    invitationCodeError,
    createFamily,
    joinFamily,
    leaveFamily,
    deleteFamily,
    refreshCurrentFamily: mutateCurrentFamily,
    refreshFamilyMembers: mutateFamilyMembers,
  };
};
