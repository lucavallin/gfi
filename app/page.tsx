"use client";

import { Layout } from "@/components/Layout";
import { Loader } from "@/components/Loader";
import { SortPicker } from "@/components/Picker";
import { RepositoryList, SearchBar } from "@/components/Repository";
import { parseQueryString, queryIsNotEmpty, updateUrlQuery } from "@/lib/helpers";
import { Server } from "@/lib/trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRepositoryQuery } from "store";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const { query, setInitialQuery } = useRepositoryQuery();
  const { data, isInitialLoading, isPreviousData } = Server.route.getRepositories.useInfiniteQuery(
    query,
    {
      keepPreviousData: true,
      getNextPageParam({ repositories }, allPages) {
        return repositories.length > 0 ? allPages[0].repositories.length + 1 : undefined;
      }
    }
  );

  // update the url query when the query changes
  useEffect(() => {
    if (queryIsNotEmpty(query)) {
      router.push(`?${updateUrlQuery(query)}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // set the initial query from the url query
  useEffect(() => {
    if (params.toString()) {
      setInitialQuery(parseQueryString(params.toString()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <main className="grow md:max-w-sm lg:max-w-none ">
        <div className="px-6">
          <div className={`sticky top-0 z-50  bg-black-400 transition-all duration-300 `}>
            <SortPicker isLoading={isPreviousData} />
            <SearchBar />
          </div>
          {isInitialLoading ? (
            <div className="mt-20">
              <Loader />
            </div>
          ) : (
            data && (
              <RepositoryList
                repos={data.pages[0].repositories}
                hasNextPage={data.pages[0].hasNextPage ?? false}
              />
            )
          )}
        </div>
      </main>
    </Layout>
  );
}
