import { onRequestGet as __api_admin_adsterra_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/adsterra.ts"
import { onRequestGet as __api_admin_chat_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/chat.ts"
import { onRequestGet as __api_admin_guests_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/guests.ts"
import { onRequestGet as __api_admin_reports_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/reports.ts"
import { onRequestGet as __api_admin_stats_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/stats.ts"
import { onRequestGet as __api_admin_users_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/users.ts"
import { onRequestPost as __api_admin_users_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/users.ts"
import { onRequestPut as __api_admin_users_ts_onRequestPut } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/admin/users.ts"
import { onRequestPost as __api_auth_register_guest_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/auth/register-guest.ts"
import { onRequestPost as __api_chat_generate_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/chat/generate.ts"
import { onRequestGet as __api_profiles__id__ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/profiles/[id].ts"
import { onRequestGet as __api_assets___path___ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/assets/[[path]].ts"
import { onRequestPost as __api_chat_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/chat.ts"
import { onRequestGet as __api_conversations_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/conversations.ts"
import { onRequestPost as __api_heartbeat_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/heartbeat.ts"
import { onRequestGet as __api_messages_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/messages.ts"
import { onRequestPost as __api_messages_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/messages.ts"
import { onRequestGet as __api_profiles_index_ts_onRequestGet } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/profiles/index.ts"
import { onRequestPost as __api_upload_ts_onRequestPost } from "/Users/milhanmohideen/adultwebsitedatingchataj/functions/api/upload.ts"

export const routes = [
    {
      routePath: "/api/admin/adsterra",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_adsterra_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/chat",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_chat_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/guests",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_guests_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/reports",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_reports_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/stats",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_stats_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestPut],
    },
  {
      routePath: "/api/auth/register-guest",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_guest_ts_onRequestPost],
    },
  {
      routePath: "/api/chat/generate",
      mountPath: "/api/chat",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_generate_ts_onRequestPost],
    },
  {
      routePath: "/api/profiles/:id",
      mountPath: "/api/profiles",
      method: "GET",
      middlewares: [],
      modules: [__api_profiles__id__ts_onRequestGet],
    },
  {
      routePath: "/api/assets/:path*",
      mountPath: "/api/assets",
      method: "GET",
      middlewares: [],
      modules: [__api_assets___path___ts_onRequestGet],
    },
  {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_ts_onRequestPost],
    },
  {
      routePath: "/api/conversations",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_conversations_ts_onRequestGet],
    },
  {
      routePath: "/api/heartbeat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_heartbeat_ts_onRequestPost],
    },
  {
      routePath: "/api/messages",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_messages_ts_onRequestGet],
    },
  {
      routePath: "/api/messages",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_messages_ts_onRequestPost],
    },
  {
      routePath: "/api/profiles",
      mountPath: "/api/profiles",
      method: "GET",
      middlewares: [],
      modules: [__api_profiles_index_ts_onRequestGet],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_upload_ts_onRequestPost],
    },
  ]