import { FeaturePlaceholder } from "../../../components/common/FeaturePlaceholder";

export function TaskForm() {
  return (
    <FeaturePlaceholder
      title="Task Form"
      description="Shared create and edit task form."
      route="shared component"
      highlights={["Rich editor", "Multi-select assignee", "Due date", "Priority"]}
    />
  );
}

