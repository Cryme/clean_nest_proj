import { Aggregate } from "src/aggregate";


export type EventAggregateProps = {
	createdAt: Date;
	title: string;
};

export class HelloAggregate extends Aggregate<EventAggregateProps> {
	get title(): string {
		return this.props.title;
	}
}
