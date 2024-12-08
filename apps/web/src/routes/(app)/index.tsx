import { createFileRoute } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useXrpc } from '@/hooks/use-xrpc';

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { rpc } = useXrpc();

  const { isPending, data } = useQuery({
    queryKey: ['moe.hayden.cookware.getRecipes', { cursor: '' }],
    queryFn: () => rpc.get('moe.hayden.cookware.getRecipes', {
      params: { cursor: '' },
    }),
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Community
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Browse Recipes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data && data.data.recipes.map((v, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>
                  <a href={`/recipe/${v.did}/${v.rkey}`}>{v.title}</a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{v.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
