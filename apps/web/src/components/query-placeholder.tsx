import type { UseQueryResult } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { XRPCError } from '@atcute/client';

type QueryPlaceholderProps<TData, TError> = PropsWithChildren<{
  query: UseQueryResult<TData, TError>;
  cards?: boolean;
  cardsCount?: number;
}>;

const QueryPlaceholder = <TData = {}, TError = Error>(
  {
    query,
    children,
    cards = false,
    cardsCount = 3,
  }: QueryPlaceholderProps<TData, TError>
) => {
  if (query.isPending || query.isLoading) {
    if (cards) {
      return [...Array(cardsCount)].map((_, i) => <Skeleton key={i} className="h-[200px] w-full rounded-lg" />);
    }

    return (
      <p>Loading...</p>
    )
  } else if (query.isError) {
    const { error } = query;
    let errMsg = 'Unknown';
    if (error instanceof XRPCError) {
      errMsg = error.kind ?? `HTTP_${error.status}`;
    } if (error instanceof Error) {
      errMsg = `${error.message} (${error.name})`;
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />

        <AlertTitle>Error fetching data.</AlertTitle>
        <AlertDescription>
          The data you were trying to see failed to fetch.<br/>
          <b>Error code: {errMsg}</b>
        </AlertDescription>
      </Alert>
    )
  } else if (query.data) {
    return children;
  }
  return <></>;
};

export default QueryPlaceholder;
