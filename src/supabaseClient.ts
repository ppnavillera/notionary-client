// src/supabaseClient.ts (수정된 전체 코드)

import { createClient } from "@supabase/supabase-js";

// 환경 변수에서 가져오는 것이 더 안전하지만, 일단은 직접 입력합니다.
const supabaseUrl = "https://nxogwwumniauclwarsbt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54b2d3d3VtbmlhdWNsd2Fyc2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNTM1NjksImV4cCI6MjA1NTcyOTU2OX0.o7e696iNElpKs04ALRA4esvgLgUSsS559zYW4wLVqVw";

// Supabase 클라이언트를 생성하고 export 합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
