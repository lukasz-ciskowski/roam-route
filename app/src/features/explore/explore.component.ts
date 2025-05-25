import { Component, signal, input, Input, computed, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of } from 'rxjs';
import { actions } from 'astro:actions';
import type { SharedRoute } from '../../services/explore.service';
import { RouteCardComponent } from '../../shared/components/route-card/route-card.component';

interface InitialData {
    routes: SharedRoute[];
    total: number;
    pageSize: number;
}

@Component({
    selector: 'explore-component',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouteCardComponent,
    ],
    templateUrl: './explore.component.html',
})
export class ExploreComponent {
    initialData = input<InitialData>();

    routes = signal<SharedRoute[] | undefined>(undefined);
    total = signal<number | undefined>(undefined);
    pageSize = signal<number | undefined>(undefined);

    page = signal<number>(1);
    isLoading = signal(false);
    searchControl = new FormControl('');

    data = computed(() => {
        return {
            routes: this.routes() ?? this.initialData()?.routes ?? [],
            total: this.total() ?? this.initialData()?.total ?? 0,
            pageSize: this.pageSize() ?? this.initialData()?.pageSize ?? 0,
        };
    });

    ngOnInit() {
        if (this.initialData()) {
            const data = this.initialData();
            if (!data) return;
            this.routes.set(data.routes);
            this.total.set(data.total);
            this.pageSize.set(data.pageSize);
        }

        // Handle search input with debounce
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((search) => {
            this.page.set(0);
            this.loadRoutes(1, search || undefined);
        });
    }

    async loadRoutes(page: number, search?: string) {
        this.isLoading.set(true);
        try {
            const result = await actions.getSharedRoutes({
                page,
                search,
            });
            if (!result.data) return;

            this.routes.set(result.data.routes);
            this.total.set(result.data.total);
        } catch (error) {
            console.error('Failed to load routes:', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    handlePageChange(event: PageEvent) {
        this.page.set(event.pageIndex);
        this.loadRoutes(event.pageIndex + 1, this.searchControl.value || undefined);
    }
}
