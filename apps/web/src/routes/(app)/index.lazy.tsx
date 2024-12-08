import { createLazyFileRoute, Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useXrpc } from '@/hooks/use-xrpc'
import { Clock, CookingPot, ListIcon } from 'lucide-react'
import QueryPlaceholder from '@/components/query-placeholder'

export const Route = createLazyFileRoute('/(app)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { rpc } = useXrpc()

  const query = useQuery({
    queryKey: ['moe.hayden.cookware.getRecipes', { cursor: '' }],
    queryFn: () =>
      rpc.get('moe.hayden.cookware.getRecipes', {
        params: { cursor: '' },
      }),
  })

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild><Link href="/">Community</Link></BreadcrumbLink>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <QueryPlaceholder query={query} cards cardsCount={12}>
            {query.data?.data.recipes.map((v, idx) => (
              <Link key={idx} href={`/recipes/${v.did}/${v.rkey}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{v.description}</p>
                  </CardContent>
                  <CardFooter className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <ListIcon className="size-4" /> <span>{v.steps}</span>
                    </span>

                    <span className="flex items-center gap-2">
                      <CookingPot className="size-4" /> <span>{v.ingredients}</span>
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock className="size-4" /> <span>30min.</span>
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </QueryPlaceholder>
        </div>
      </div>
    </>
  )
}
