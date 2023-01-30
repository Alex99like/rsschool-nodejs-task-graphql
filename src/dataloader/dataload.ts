import * as DataLoader from 'dataloader'
import {FastifyInstance} from "fastify";
import {UserService} from "../routes/users/services";
import {UserEntity} from "../utils/DB/entities/DBUsers";
import {ProfileService} from "../routes/profiles/services";
import {PostService} from "../routes/posts/services";
import {MemberTypeEntity} from "../utils/DB/entities/DBMemberTypes";
import {ProfileEntity} from "../utils/DB/entities/DBProfiles";
import {MemberTypeService} from "../routes/member-types/services";

const batchUsers = async (ids: readonly string[], fastify: FastifyInstance) => {
  const users = await UserService.getAll(fastify)
  const dataMap: Record<string, UserEntity> = users.reduce((acc, user) => ({...acc, [user.id]: user}), {});
  return ids.map((id) => dataMap[id]);
}

const batchMemberTypes = async (ids: readonly string[], fastify: FastifyInstance) => {
  const memberTypes = await MemberTypeService.getAll(fastify)
  const dataMap: Record<string, MemberTypeEntity> = memberTypes.reduce((acc, memberType) => ({...acc, [memberType.id]: memberType}), {});
  return ids.map((id) => dataMap[id]);
}

const batchProfiles = async (ids: readonly string[], fastify: FastifyInstance) => {
  const profiles = await ProfileService.getAll(fastify)
  const dataMap: Record<string, ProfileEntity> = profiles.reduce((acc, profile) => ({...acc, [profile.id]: profile }), {});
  return ids.map((id) => dataMap[id]);
}

const batchPosts = async (ids: readonly string[], fastify: FastifyInstance) => {
  const posts = await PostService.getAll(fastify)
  const dataMap: Record<string, UserEntity[]> = posts.reduce((acc, post) => ({...acc, [post.id]: post}), {});
  return ids.map((id) => dataMap[id]);
}

export const createLoaders = (context: FastifyInstance) => {
  return {
    usersLoader: new DataLoader( async (ids: readonly string[]) => batchUsers(ids, context)),
    memberTypesLoader: new DataLoader( async (ids: readonly string[]) => batchMemberTypes(ids, context)),
    profilesLoader: new DataLoader( async (ids: readonly string[]) => batchProfiles(ids, context)),
    postsLoader: new DataLoader( async (ids: readonly string[]) => batchPosts(ids, context)),
  }
}

export type LoadersType = ReturnType<typeof createLoaders>
