import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import DotIcon from "../icons/doticon";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deleteDoc, doc,getFirestore } from "firebase/firestore";
import app from "@/lib/firebase/config";
export default function ChartDisplay({ docs }) {
  const db = getFirestore(app);
  const router = useRouter();

  const handleDelete = (id) => {
    try {
      const ref = doc(db, "graphs", id);
      deleteDoc(ref)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return docs.map((doc) => (
    <div key={doc.id}>
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Link href={`/edit/${doc.id}`}>
            <CardTitle className="text-sm font-medium">
              {doc.data.type}
            </CardTitle>
          </Link>
          <DropdownMenu className="h-4 w-4 text-muted-foreground">
            <DropdownMenuTrigger asChild>
              <Button className="h-5 w-5" size="icon" variant="ghost">
                <DotIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="h-1">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this chart and associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <Button onClick={() => handleDelete(doc.id)}>
                          Continue
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <Link href={`/edit/${doc.id}`}>
          <CardContent>
            <div className="text-xl font-bold">{doc.data.name}</div>
            {/* <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p> */}
          </CardContent>
        </Link>
      </Card>
    </div>
  ));
}
