import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HomeHeader() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-background sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-accent border-2 border-background"></span>
                </div>
            </div>

            <div className="text-primary font-bold text-xl tracking-wider">
                POORTAL
            </div>

            <Button variant="ghost" size="icon" className="relative text-foreground">
                <div className="w-6 h-6 flex flex-col gap-[3px] items-end justify-center">
                    <span className="w-5 h-[2px] bg-foreground rounded-full"></span>
                    <span className="w-3 h-[2px] bg-foreground rounded-full"></span>
                    <span className="w-5 h-[2px] bg-foreground rounded-full"></span>
                </div>
            </Button>
        </header>
    )
}
