"use client";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { createTag } from "@/services/tags/create-tag";
import type { Tag } from "@/services/tags/tag.type";
import { TagChips } from "../tag-chips/tag-chips";
import styles from "./tag-select.module.css";
import { useTagOptions } from "../use-tag-options";

export interface TagSelectProps {
  value: string[];
  onChange: (names: string[]) => void;
  error?: string;
  /** Applicants filtering a job list may pick tags but must not create them. */
  allowCreate?: boolean;
  label?: string;
}

const normalize = (name: string) => name.trim().toLocaleLowerCase();
const CREATE_OPTION_ID = "__create__";

export function TagSelect({
  value,
  onChange,
  error,
  allowCreate = true,
  label = "Tags",
}: TagSelectProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const {
    options,
    loading,
    error: optionsError,
    addTag,
  } = useTagOptions({
    enabled: open,
    query: inputValue,
    limit: 10,
    debounceMs: 300,
  });

  const selectedNames = useMemo(() => new Set(value.map(normalize)), [value]);
  const atLimit = value.length >= 10;

  const selectedOptions = useMemo<Tag[]>(
    () => value.map((name) => ({ id: name, name })),
    [value],
  );

  const trimmedInput = inputValue.trim();
  const matchesExisting = options.some(
    (option) => normalize(option.name) === normalize(trimmedInput),
  );

  const canCreate =
    allowCreate &&
    trimmedInput.length > 0 &&
    !matchesExisting &&
    !selectedNames.has(normalize(trimmedInput)) &&
    !atLimit;

  /** Creates the tag and returns its stored name, or null if it failed. */
  const createTagByName = async (name: string): Promise<string | null> => {
    setIsCreating(true);
    try {
      const created = await createTag(name.trim());
      addTag(created);
      enqueueSnackbar(`Tag ${created.name} created.`, { variant: "success" });
      return created.name;
    } catch (caught) {
      enqueueSnackbar(
        caught instanceof Error ? caught.message : "Failed to create tag.",
        { variant: "error" },
      );
      return null;
    } finally {
      setIsCreating(false);
      setInputValue("");
    }
  };

  /**
   * The create row lives inside the listbox rather than below the input: the
   * popper is portaled above the page, so any button underneath it is
   * unclickable. It also makes Enter work for free via the listbox.
   */
  const listOptions = useMemo<Tag[]>(() => {
    if (!canCreate) return options;
    return [{ id: CREATE_OPTION_ID, name: trimmedInput }, ...options];
  }, [canCreate, options, trimmedInput]);

  const handleChange = async (_event: unknown, next: Tag[]) => {
    const picked = next.filter((option) => option.id !== CREATE_OPTION_ID);
    const names = picked.map((option) => option.name);
    const requested = next.find((option) => option.id === CREATE_OPTION_ID);

    if (!requested) {
      onChange(names);
      return;
    }

    // Build the result from `picked` so a tag selected while the request is in
    // flight is not lost to a stale `value` closure.
    const createdName = await createTagByName(requested.name);
    onChange(createdName === null ? names : [...names, createdName]);
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((existing) => existing !== name));
  };

  const helper =
    error ??
    optionsError ??
    (atLimit
      ? "Up to 10 tags selected."
      : allowCreate
        ? "Pick a tag or type a new one."
        : "Pick a tag to filter by.");

  return (
    <div className={styles.wrapper}>
      <Autocomplete
        multiple
        disabled={atLimit}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={listOptions}
        value={selectedOptions}
        inputValue={inputValue}
        onInputChange={(_event, next) => setInputValue(next)}
        onChange={handleChange}
        isOptionEqualToValue={(option, selected) =>
          normalize(option.name) === normalize(selected.name)
        }
        getOptionLabel={(option) => option.name}
        filterOptions={(options_) => options_}
        loading={loading || isCreating}
        noOptionsText={loading ? "Loading tags..." : "No matching tags."}
        renderOption={(props, option) =>
          option.id === CREATE_OPTION_ID ? (
            <li {...props} key={option.id} className={styles.createOption}>
              <AddIcon fontSize="small" />
              Create tag &quot;{option.name}&quot;
            </li>
          ) : (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={
              allowCreate ? "Search or add tags..." : "Search tags..."
            }
            error={Boolean(error)}
            helperText={helper}
            variant="outlined"
          />
        )}
      />

      <div className={styles.preview}>
        <p className={styles.previewLabel}>Selected tags</p>
        <TagChips
          names={value}
          onRemove={handleRemove}
          emptyLabel="No tags selected yet"
        />
      </div>
    </div>
  );
}

export default TagSelect;
