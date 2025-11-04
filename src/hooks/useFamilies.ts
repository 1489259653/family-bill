import useSWR from 'swr';
import { fetcher, CreateFamilyData, JoinFamilyData } from '../services/api';
import { FamilyMembersResponse, FamilyMember } from '../types';

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
  data: {
    invitationCode: string;
  };
}

// Families相关hooks
export const useFamilies = (): {
  currentFamily: any;
  currentFamilyError: ErrorResponse | undefined;
  familyMembers: FamilyMember[];
  familyMembersError: ErrorResponse | undefined;
  invitationCode: string | undefined;
  invitationCodeError: Error | undefined;
  createFamily: (data: CreateFamilyData) => Promise<any>;
  joinFamily: (data: JoinFamilyData) => Promise<any>;
  leaveFamily: () => Promise<any>;
  refreshCurrentFamily: (data?: any) => Promise<any>;
  refreshFamilyMembers: (data?: any) => Promise<any>;
} => {
  // 获取当前家庭信息
  const { data: currentFamily, error: currentFamilyError, mutate: mutateCurrentFamily } = 
    useSWR('/families/current', fetcher<any>);

  // 获取家庭成员
  const { data: familyMembersResponse, error: familyMembersError, mutate: mutateFamilyMembers } = 
    useSWR<FamilyMembersResponse>('/families/members', fetcher);
    
  // 提取成员数组数据
  const familyMembers = familyMembersResponse?.data || [];
  // 获取邀请码
  // 返回：
  // {"success":true,"data":{"invitationCode":"CEE5AE4594F8"}}
  const { data: invitationCodeResponse, error: invitationCodeError } = 
    useSWR<InvitationCodeResponse>('/families/invitation-code', fetcher);
  
  // 提取直接的邀请码字符串
  const invitationCode = invitationCodeResponse?.data?.invitationCode;

  // 创建家庭
  const createFamily = async (data: CreateFamilyData) => {
    const result = await fetcher('/families', 'POST', data);
    mutateCurrentFamily(); // 重新获取当前家庭信息
    return result;
  };

  // 加入家庭
  const joinFamily = async (data: JoinFamilyData) => {
    const result = await fetcher('/families/join', 'POST', data);
    mutateCurrentFamily(); // 重新获取当前家庭信息
    return result;
  };

  // 退出家庭
  const leaveFamily = async () => {
    const result = await fetcher('/families/leave', 'POST');
    mutateCurrentFamily(null); // 清除当前家庭信息
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
    refreshCurrentFamily: mutateCurrentFamily,
    refreshFamilyMembers: mutateFamilyMembers
  };
};